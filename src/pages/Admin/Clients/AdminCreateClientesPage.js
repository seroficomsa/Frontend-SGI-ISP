import React, { useState, useEffect } from "react";
import {
  Typography,
  Tabs,
  Form,
  Input,
  Button,
  Alert,
  message,
  Row,
  Col,
  Card,
  Select,
  DatePicker,
  Spin,
  Descriptions,
} from "antd";
import {
  UserOutlined,
  MailOutlined,
  PhoneOutlined,
  EnvironmentOutlined,
  SolutionOutlined,
  CheckCircleOutlined,
} from "@ant-design/icons";
import useAuth from "../../../hooks/useAuth";
import { crearCliente, verificarCorreo } from "../../../api/clients";
import { listarPlanes } from "../../../api/plans";
import { listarIPPools } from "../../../api/ippools";
import { obtenerRouters } from "../../../api/routers";
import { obtenerOnts } from "../../../api/onts"; // Nueva función para obtener ONTs
import { useNavigate } from "react-router-dom";
import moment from "moment";

const { TabPane } = Tabs;
const { Option } = Select;

export default function CrearClientePage() {
  const [form] = Form.useForm();
  const { user } = useAuth();
  const navigate = useNavigate();

  // Manejo de estados
  const [loading, setLoading] = useState(false);
  const [isFormValid, setIsFormValid] = useState(false);
  const [correoValido, setCorreoValido] = useState(null);

  // Catálogos
  const [routers, setRouters] = useState([]);
  const [planes, setPlanes] = useState([]);
  const [ippools, setIPPools] = useState([]);
  const [onts, setOnts] = useState([]); // Nuevo estado para ONTs
  const [loadingRouters, setLoadingRouters] = useState(false);
  const [loadingPlanes, setLoadingPlanes] = useState(false);
  const [loadingIPPools, setLoadingIPPools] = useState(false);
  const [loadingOnts, setLoadingOnts] = useState(false); // Estado de carga para ONTs

  // Filtrados
  const [filteredPlanes, setFilteredPlanes] = useState([]);
  const [filteredIPPools, setFilteredIPPools] = useState([]);

  // Router seleccionado
  const [selectedRouter, setSelectedRouter] = useState(null);
  // Tab activo
  const [activeTab, setActiveTab] = useState("1");

  // Almacenar credenciales PPPoE + Info ONT
  const [pppoeCreds, setPppoeCreds] = useState(null);

  // Carga inicial de datos (Routers, Planes, Pools, ONTs)
  useEffect(() => {
    const obtenerDatos = async () => {
      setLoadingRouters(true);
      setLoadingPlanes(true);
      setLoadingIPPools(true);
      setLoadingOnts(true);
      try {
        const token = user.access_token;
        const [routersResp, planesResp, ippoolsResp, ontsResp] = await Promise.all([
          obtenerRouters(token),
          listarPlanes(token),
          listarIPPools(token),
          obtenerOnts(token),
        ]);
        setRouters(routersResp.data);
        setPlanes(planesResp.data);
        setIPPools(ippoolsResp.data);
        setOnts(ontsResp.data);
      } catch (error) {
        message.error("Error al cargar los datos.");
      } finally {
        setLoadingRouters(false);
        setLoadingPlanes(false);
        setLoadingIPPools(false);
        setLoadingOnts(false);
      }
    };
    obtenerDatos();
  }, [user.access_token]);

  // Validar cambios en el formulario
  const handleFormChange = async () => {
    try {
      await form.validateFields();
      setIsFormValid(true);
    } catch {
      setIsFormValid(false);
    }
  };

  // Verificar correo al perder el foco
  const handleCorreoBlur = async (correo) => {
    if (!correo) return;
    try {
      const response = await verificarCorreo(correo, user.access_token);
      if (response.exists) {
        setCorreoValido(false);
        message.error("El correo electrónico ya está registrado.");
      } else {
        setCorreoValido(true);
        message.success("Correo electrónico válido.");
      }
    } catch (error) {
      setCorreoValido(false);
      message.error("Error al verificar el correo electrónico.");
    }
  };

  // Manejar selección de router
  const handleRouterChange = (idRouter) => {
    setSelectedRouter(idRouter);
    setFilteredPlanes(planes.filter((plan) => plan.id_router === idRouter));
    setFilteredIPPools(ippools.filter((pool) => pool.id_router === idRouter));
  };

  // Crear cliente (submit)
  const handleSubmit = async () => {
    try {
      await form.validateFields();
      if (correoValido === false) {
        return message.error("Debe usar un correo electrónico que no esté registrado.");
      }
      setLoading(true);

      const token = user.access_token;
      const formValues = form.getFieldsValue();

      // Convertir fecha_nacimiento si existe
      if (formValues.fecha_nacimiento) {
        formValues.fecha_nacimiento = formValues.fecha_nacimiento.format("YYYY-MM-DD");
      }

      const response = await crearCliente({ ...formValues, estado: "A" }, token);

      if (response.success) {
        message.success("Cliente creado exitosamente.");
        // Guardar credenciales PPPoE y datos de la ONT
        setPppoeCreds({
          login: response.cliente.login,
          password: response.password_generada,
          ontInfo: response.ont_registration, // <-- Aquí guardamos la info de la ONT
        });
      } else {
        message.error(response.message || "Error al crear el cliente.");
      }
    } catch (error) {
      if (error.response?.status === 422) {
        message.error(error.response?.data?.message || "Error en los datos ingresados.");
      } else {
        message.error("Error al crear el cliente.");
      }
    } finally {
      setLoading(false);
    }
  };

  // Vista final: Credenciales generadas
  if (pppoeCreds) {
    return (
      <div style={{ padding: 16 }}>
        <Card
          style={{
            borderRadius: 8,
            textAlign: "center",
            backgroundColor: "#fff",
          }}
        >
          <div style={{ display: "flex", justifyContent: "center", marginBottom: 16 }}>
            <CheckCircleOutlined style={{ fontSize: 32, color: "#ff4d4f" }} />
            <Typography.Title
              level={4}
              style={{ marginLeft: 10, color: "#ff4d4f", fontWeight: "bold" }}
            >
              Credenciales PPPoE generadas
            </Typography.Title>
          </div>
          <div style={{ fontSize: 16, textAlign: "center", marginBottom: 24 }}>
            <p>
              <strong>Usuario/Login:</strong> {pppoeCreds.login}
            </p>
            <p>
              <strong>Contraseña:</strong> {pppoeCreds.password}
            </p>
          </div>

          {/* Sección adicional: Información de la ONU Registrada */}
          {pppoeCreds.ontInfo && pppoeCreds.ontInfo.data && (
            <div style={{ marginTop: 24, textAlign: "left" }}>
              <Typography.Title level={5} style={{ fontWeight: "bold" }}>
                Información de la ONU Registrada
              </Typography.Title>
              <Descriptions bordered size="small" column={1}>
                <Descriptions.Item label="Mensaje">
                  {pppoeCreds.ontInfo.message}
                </Descriptions.Item>
                <Descriptions.Item label="PON ID">
                  {pppoeCreds.ontInfo.data.pon_id}
                </Descriptions.Item>
                <Descriptions.Item label="ONU ID">
                  {pppoeCreds.ontInfo.data.onu_id}
                </Descriptions.Item>
                <Descriptions.Item label="Serial GPON">
                  {pppoeCreds.ontInfo.data.gpon_serial}
                </Descriptions.Item>
                <Descriptions.Item label="Online Status">
                  {pppoeCreds.ontInfo.data.online_status}
                </Descriptions.Item>
                <Descriptions.Item label="Active Status">
                  {pppoeCreds.ontInfo.data.active_status}
                </Descriptions.Item>
                <Descriptions.Item label="RX (dBm)">
                  {pppoeCreds.ontInfo.data.rx_dbm}
                </Descriptions.Item>
                <Descriptions.Item label="TX (dBm)">
                  {pppoeCreds.ontInfo.data.tx_dbm}
                </Descriptions.Item>
              </Descriptions>
            </div>
          )}

          <Typography.Text style={{ fontSize: 16 }}>
            El cliente ha sido creado correctamente. Ahora puede conectarse con estas credenciales PPPoE.
          </Typography.Text>
          <div style={{ marginTop: 24 }}>
            <Button
              onClick={() => navigate("/admin/clientes")}
              style={{
                backgroundColor: "#ff4d4f",
                borderColor: "#ff4d4f",
                color: "#fff",
                borderRadius: 8,
                fontWeight: "bold",
                width: 180,
              }}
            >
              Ir a la Lista de Clientes
            </Button>
          </div>
        </Card>
      </div>
    );
  }

  // Formulario principal
  return (
    <div style={{ padding: 16 }}>
      <Typography.Title level={3} style={{ color: "#ff4d4f", fontWeight: "bold" }}>
        Crear Cliente
      </Typography.Title>

      <Card
        style={{
          borderRadius: 8,
          boxShadow: "0px 2px 8px rgba(0, 0, 0, 0.1)",
        }}
      >
        {/* Spinner de creación */}
        {loading && (
          <div style={{ textAlign: "center", marginBottom: 16 }}>
            <Spin tip="Creando Perfil PPPoE..." size="large" />
          </div>
        )}

        <Tabs activeKey={activeTab} onChange={setActiveTab}>
          {/* TAB 1: Información Personal */}
          <TabPane
            key="1"
            tab={
              <span>
                <UserOutlined /> Información Personal
              </span>
            }
          >
            <Form
              form={form}
              layout="vertical"
              onValuesChange={handleFormChange}
              style={{ marginTop: 16 }}
            >
              <Row gutter={[16, 16]}>
                <Col xs={24} md={12}>
                  <Form.Item
                    label="Nombres"
                    name="nombres"
                    rules={[{ required: true, message: "Ingrese los nombres" }]}
                  >
                    <Input placeholder="Nombres" prefix={<UserOutlined />} />
                  </Form.Item>
                </Col>

                <Col xs={24} md={12}>
                  <Form.Item
                    label="Apellidos"
                    name="apellidos"
                    rules={[{ required: true, message: "Ingrese los apellidos" }]}
                  >
                    <Input placeholder="Apellidos" prefix={<UserOutlined />} />
                  </Form.Item>
                </Col>
              </Row>

              <Row gutter={[16, 16]}>
                <Col xs={24} md={12}>
                  <Form.Item
                    label="Fecha de Nacimiento"
                    name="fecha_nacimiento"
                    rules={[{ required: true, message: "Ingrese la fecha de nacimiento" }]}
                  >
                    <DatePicker
                      style={{ width: "100%" }}
                      format="YYYY-MM-DD"
                      placeholder="Seleccione la fecha"
                    />
                  </Form.Item>
                </Col>

                <Col xs={24} md={12}>
                  <Form.Item
                    label="Cédula o Identificación"
                    name="identificacion"
                    rules={[
                      { required: true, message: "Ingrese la cédula o identificación" },
                      { pattern: /^\d{10}$/, message: "La cédula debe tener 10 dígitos" },
                    ]}
                  >
                    <Input maxLength={10} placeholder="Cédula o Identificación" />
                  </Form.Item>
                </Col>
              </Row>
            </Form>
          </TabPane>

          {/* TAB 2: Información de Contacto */}
          <TabPane
            key="2"
            tab={
              <span>
                <PhoneOutlined /> Información de Contacto
              </span>
            }
          >
            {correoValido === false && (
              <Alert
                message="El correo electrónico ya está registrado."
                type="error"
                showIcon
                style={{ marginBottom: 16 }}
              />
            )}
            <Form
              form={form}
              layout="vertical"
              onValuesChange={handleFormChange}
              style={{ marginTop: 16 }}
            >
              <Row gutter={[16, 16]}>
                <Col xs={24} md={12}>
                  <Form.Item
                    label="Correo Electrónico"
                    name="correo_electronico"
                    rules={[
                      { required: true, type: "email", message: "Ingrese un correo electrónico válido" },
                    ]}
                  >
                    <Input
                      placeholder="Correo Electrónico"
                      prefix={<MailOutlined />}
                      onBlur={(e) => handleCorreoBlur(e.target.value)}
                    />
                  </Form.Item>
                </Col>

                <Col xs={24} md={12}>
                  <Form.Item
                    label="Teléfono Principal"
                    name="telefono_principal"
                    rules={[
                      { required: true, message: "Ingrese el teléfono principal" },
                      { pattern: /^09\d{8}$/, message: "Debe comenzar con 09 y tener 10 dígitos" },
                    ]}
                  >
                    <Input maxLength={10} placeholder="Teléfono Principal" prefix={<PhoneOutlined />} />
                  </Form.Item>
                </Col>
              </Row>

              <Row gutter={[16, 16]}>
                <Col xs={24} md={12}>
                  <Form.Item
                    label="Teléfono Secundario (opcional)"
                    name="telefono_secundario"
                    rules={[
                      { pattern: /^09\d{8}$/, message: "Debe comenzar con 09 y tener 10 dígitos" },
                    ]}
                  >
                    <Input maxLength={10} placeholder="Teléfono Secundario" prefix={<PhoneOutlined />} />
                  </Form.Item>
                </Col>

                <Col xs={24} md={12}>
                  <Form.Item
                    label="Dirección"
                    name="direccion"
                    rules={[{ required: true, message: "Ingrese la dirección" }]}
                  >
                    <Input.TextArea rows={3} placeholder="Dirección" prefix={<EnvironmentOutlined />} />
                  </Form.Item>
                </Col>
              </Row>

              <Row gutter={[16, 16]}>
                <Col xs={24} md={12}>
                  <Form.Item label="Referencia de Dirección (opcional)" name="referencia_direccion">
                    <Input.TextArea rows={2} placeholder="Referencia" />
                  </Form.Item>
                </Col>

                <Col xs={24} sm={12} md={6}>
                  <Form.Item label="Latitud (opcional)" name="latitud">
                    <Input placeholder="Latitud" />
                  </Form.Item>
                </Col>

                <Col xs={24} sm={12} md={6}>
                  <Form.Item label="Longitud (opcional)" name="longitud">
                    <Input placeholder="Longitud" />
                  </Form.Item>
                </Col>
              </Row>
            </Form>
          </TabPane>

          {/* TAB 3: Asignación de Servicio */}
          <TabPane
            key="3"
            tab={
              <span>
                <SolutionOutlined /> Asignación de Servicio
              </span>
            }
          >
            <Form
              form={form}
              layout="vertical"
              onValuesChange={handleFormChange}
              style={{ marginTop: 16 }}
            >
              <Row gutter={[16, 16]}>
                <Col xs={24} md={12}>
                  <Form.Item
                    label="Seleccionar Router"
                    name="id_router"
                    rules={[{ required: true, message: "Seleccione un router" }]}
                  >
                    <Select
                      placeholder="Seleccione un router"
                      loading={loadingRouters}
                      onChange={handleRouterChange}
                    >
                      {routers.map((router) => (
                        <Option key={router.id_router} value={router.id_router}>
                          {router.nombre_router} ({router.descripcion_router})
                        </Option>
                      ))}
                    </Select>
                  </Form.Item>
                </Col>

                <Col xs={24} md={12}>
                  <Form.Item
                    label="Seleccionar Plan"
                    name="id_plan"
                    rules={[{ required: true, message: "Seleccione un plan" }]}
                  >
                    <Select
                      placeholder="Seleccione un plan"
                      loading={loadingPlanes}
                      disabled={!selectedRouter}
                    >
                      {filteredPlanes.map((plan) => (
                        <Option key={plan.id_plan} value={plan.id_plan}>
                          {plan.nombre_plan} - ${plan.precio}
                        </Option>
                      ))}
                    </Select>
                  </Form.Item>
                </Col>
              </Row>

              <Row gutter={[16, 16]}>
                <Col xs={24} md={12}>
                  <Form.Item
                    label="Seleccionar IP Pool"
                    name="id_ippool"
                    rules={[{ required: true, message: "Seleccione un IP Pool" }]}
                  >
                    <Select
                      placeholder="Seleccione un IP Pool"
                      loading={loadingIPPools}
                      disabled={!selectedRouter}
                    >
                      {filteredIPPools.map((ippool) => (
                        <Option key={ippool.id_ippool} value={ippool.id_ippool}>
                          {ippool.nombre_pool} - {ippool.subnet}
                        </Option>
                      ))}
                    </Select>
                  </Form.Item>
                </Col>

                <Col xs={24} md={12}>
                  <Form.Item
                    label="Seleccionar ONT"
                    name="id_ont"
                    rules={[{ required: true, message: "Seleccione una ONT" }]}
                  >
                    <Select
                      placeholder="Seleccione una ONT"
                      loading={loadingOnts}
                      showSearch
                      optionFilterProp="children"
                      filterOption={(input, option) =>
                        option.children.toLowerCase().indexOf(input.toLowerCase()) >= 0
                      }
                    >
                      {onts.map((ont) => (
                        <Option key={ont.id_ont} value={ont.id_ont}>
                          {ont.modelo} - {ont.sn}
                        </Option>
                      ))}
                    </Select>
                  </Form.Item>
                </Col>
              </Row>
            </Form>
          </TabPane>
        </Tabs>

        {/* Botón para crear cliente => solo si el form es válido */}
        <div style={{ textAlign: "center", marginTop: 24 }}>
          <Button
            onClick={handleSubmit}
            disabled={!isFormValid}
            loading={loading}
            style={{
              backgroundColor: "#ff4d4f",
              borderColor: "#ff4d4f",
              color: "#fff",
              fontWeight: "bold",
              borderRadius: 8,
              width: 180,
            }}
          >
            Crear Cliente
          </Button>
        </div>
      </Card>
    </div>
  );
}