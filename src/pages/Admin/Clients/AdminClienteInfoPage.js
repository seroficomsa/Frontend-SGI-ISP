import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import {
  Typography,
  Button,
  Card,
  Row,
  Col,
  message,
  Tag,
  Space,
  Alert,
  Image,
  Skeleton
} from "antd";
import {
  ArrowLeftOutlined,
  SyncOutlined,
  UserOutlined,
  WifiOutlined,
  ShoppingCartOutlined
} from "@ant-design/icons";
import useAuth from "../../../hooks/useAuth";
import { obtenerInformacionCliente } from "../../../api/clients";
import ontTPLink from '../../../assets/img/onus/ontTpLink.png';

export default function AdminClienteInfoPage() {
  const { id_cliente } = useParams();
  const navigate = useNavigate();
  const [cliente, setCliente] = useState(null);
  const [ontInfo, setOntInfo] = useState(null);
  const [plan, setPlan] = useState(null);
  const [loading, setLoading] = useState(true);
  const { user } = useAuth();

  const fetchClienteInfo = async () => {
    setLoading(true);
    try {
      const token = user?.access_token;
      const response = await obtenerInformacionCliente(id_cliente, token);

      if (response?.success) {
        setCliente(response.data);
        setOntInfo(response.ont_info || null);
        setPlan(response.plan || null);
      } else {
        setCliente(null);
        setOntInfo(null);
        setPlan(null);
        message.error(response.message || "Error al obtener la información del cliente.");
      }
    } catch (error) {
      message.error("Error al obtener la información del cliente.");
      setCliente(null);
      setOntInfo(null);
      setPlan(null);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchClienteInfo();
  }, [id_cliente]);

  // 📌 Función para evaluar la potencia RX
  const getPotenciaRxMessage = (rxPower) => {
    if (!rxPower) return null;
    const rxValue = parseFloat(rxPower);

    if (rxValue > -1) {
      return <Alert message="Potencia extremadamente alta, revisar urgentemente" type="error" showIcon />;
    } else if (rxValue > -15) {
      return <Alert message="Potencia demasiado alta, revisar configuración" type="warning" showIcon />;
    } else if (rxValue >= -26) {
      return <Alert message="Potencia Óptima" type="success" showIcon />;
    } else {
      return <Alert message="⚠ ALERTA: Potencia fuera del estándar, verificar urgentemente" type="error" showIcon />;
    }
  };

  return (
    <div style={{ background: "#FFF", padding: "20px", borderRadius: "12px", margin: "0 auto" }}>
      {/* 📌 Encabezado con Botón de Retroceder y Actualizar */}
      <Row justify="space-between" align="middle" style={{ marginBottom: "16px", display: "flex", flexWrap: "nowrap" }}>
        <Col>
          <Button
            type="text"
            icon={<ArrowLeftOutlined />}
            onClick={() => navigate(-1)}
            style={{ fontSize: "16px", color: "#F5222D" }}
          >
            Atrás
          </Button>
        </Col>
        <Col xs={0} md={12} style={{ textAlign: "center" }}>
          <Typography.Title level={3} style={{ fontWeight: "bold", color: "#F5222D", margin: "0" }}>
            Información del Cliente
          </Typography.Title>
        </Col>
        <Col>
          <Button
            type="primary"
            onClick={fetchClienteInfo}
            icon={<SyncOutlined />}
            style={{ background: "#F5222D", borderColor: "#F5222D" }}>
            Actualizar
          </Button>
        </Col>
      </Row>

      {/* 📌 Diseño Responsivo con Grid */}
      <Row gutter={[16, 16]}>
        {/* 📌 Columna Izquierda en PC - Cliente & Plan */}
        <Col xs={24} md={12}>
          {/* 📌 Información del Cliente */}
          <Card title={<><UserOutlined /> Cliente</>} bordered={false} style={{ borderRadius: "12px", marginBottom: "16px", boxShadow: "0px 4px 10px rgba(0, 0, 0, 0.1)" }}>
            {loading ? (
              <Skeleton active />
            ) : (
              <Space direction="vertical" size="middle">
                <Typography.Text><strong>Nombre:</strong> {cliente.nombres} {cliente.apellidos}</Typography.Text>
                <Typography.Text><strong>Cédula:</strong> {cliente.identificacion}</Typography.Text>
                <Typography.Text><strong>Correo:</strong> {cliente.correo_electronico}</Typography.Text>
                <Typography.Text><strong>Teléfono:</strong> {cliente.informacion_adicional?.telefono_principal || "No registrado"}</Typography.Text>
                <Typography.Text>
                  <strong>Estado:</strong>
                  <Tag color={cliente.estado === "A" ? "green" : "red"}>
                    {cliente.estado === "A" ? "Activo" : "Inactivo"}
                  </Tag>
                </Typography.Text>
              </Space>
            )}
          </Card>

          {/* 📌 Plan Contratado */}
          <Card title={<><ShoppingCartOutlined /> Plan Contratado</>} bordered={false} style={{ borderRadius: "12px", marginBottom: "16px", boxShadow: "0px 4px 10px rgba(0, 0, 0, 0.1)" }}>
            {loading ? (
              <Skeleton active />
            ) : plan ? (
              <>
                <Typography.Text><strong>Plan:</strong> {plan.nombre_plan}</Typography.Text><br />
                <Typography.Text><strong>Velocidad Subida:</strong> {plan.mb_subida} Mbps</Typography.Text><br />
                <Typography.Text><strong>Velocidad Bajada:</strong> {plan.mb_bajada} Mbps</Typography.Text><br />
                <Typography.Text><strong>Precio:</strong> ${plan.precio}</Typography.Text>
              </>
            ) : (
              <Typography.Text>Este cliente no tiene un plan asignado.</Typography.Text>
            )}
          </Card>
        </Col>

        {/* 📌 Columna Derecha en PC - ONT */}
        <Col xs={24} md={12}>
          <Card title={<><WifiOutlined /> Información de la ONT</>} bordered={false} style={{ borderRadius: "12px", boxShadow: "0px 4px 10px rgba(0, 0, 0, 0.1)" }}>
            {loading ? (
              <Skeleton active />
            ) : ontInfo ? (
              <>
                <div style={{ display: "flex", justifyContent: "center", marginBottom: "12px" }}>
                  <Image width={120} height="auto" src={ontTPLink} alt="ONT Device" preview={false} style={{ borderRadius: "8px" }} />
                </div>
                <Space direction="vertical" size="middle">
                  <Typography.Text><strong>GPON Serial:</strong> {ontInfo.gpon_serial}</Typography.Text>
                  <Typography.Text><strong>PON ID:</strong> {ontInfo.pon_port}</Typography.Text>
                  <Typography.Text><strong>ONU ID:</strong> {ontInfo.onu_id}</Typography.Text>
                  <Typography.Text>
                    <strong>Estado:</strong>
                    <Tag color={ontInfo.online_status === "online" ? "green" : "red"}>
                      {ontInfo.online_status === "online" ? "Activo" : "Inactivo"}
                    </Tag>
                  </Typography.Text>
                  <Typography.Text><strong>Potencia RX:</strong> {ontInfo.rx_power} dBm</Typography.Text>
                  <Typography.Text><strong>Potencia TX:</strong> {ontInfo.tx_power} dBm</Typography.Text>
                  {getPotenciaRxMessage(ontInfo.rx_power)}
                </Space>
              </>
            ) : (
              <Typography.Text>Este cliente no tiene ONT asignada.</Typography.Text>
            )}
          </Card>
        </Col>
      </Row>
    </div>
  );
}
