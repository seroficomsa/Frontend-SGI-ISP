import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Typography, Form, Input, Button, Row, Col, Card, message, Spin } from "antd";
import { SaveOutlined } from "@ant-design/icons";
import { obtenerRouter, actualizarRouter } from "../../../api/routers"; // Quité `verificarConexionRouter`
import useAuth from "../../../hooks/useAuth";

export default function AdminEditRouterPage() {
  const { id_router } = useParams(); // ID del router
  const navigate = useNavigate();
  const { user } = useAuth();
  const [form] = Form.useForm();
  const [loading, setLoading] = useState(false); // Indicador de carga
  const [saving, setSaving] = useState(false); // Indicador de guardado

  // Función para cargar los datos del router
  const fetchRouter = async () => {
    if (!id_router) {
      message.error("ID del router no especificado.");
      navigate("/admin/routers");
      return;
    }

    setLoading(true);
    try {
      const token = user?.access_token;
      const response = await obtenerRouter(id_router, token);

      if (response?.data) {
        form.setFieldsValue(response.data); // Cargar datos en el formulario
      } else {
        throw new Error("No se pudo cargar la información del router.");
      }
    } catch (error) {
      console.error("Error al cargar el router:", error);
      message.error("Error al cargar el router. Por favor, intenta de nuevo.");
      navigate("/admin/routers");
    } finally {
      setLoading(false);
    }
  };

  // Guardar cambios
  const handleSubmit = async (values) => {
    setSaving(true);
    try {
      const token = user?.access_token;
      const response = await actualizarRouter(id_router, values, token);

      if (response.success) {
        message.success(response.message || "Router actualizado exitosamente.");
        navigate("/admin/routers");
      } else {
        message.error(response.message || "No se pudo actualizar el router. Verifica los datos.");
      }
    } catch (error) {
      console.error("Error al actualizar el router:", error);
      message.error("Error al actualizar el router. Por favor, verifica los datos.");
    } finally {
      setSaving(false);
    }
  };

  // Cargar datos al montar el componente
  useEffect(() => {
    fetchRouter();
  }, [id_router]);

  return (
    <div style={{ padding: "16px", maxWidth: "1200px", margin: "0 auto" }}>
      <Typography.Title level={3} style={{ textAlign: "center", marginBottom: "24px" }}>
        Editar Router
      </Typography.Title>

      <Card style={{ padding: "24px", borderRadius: "8px" }}>
        {loading ? (
          <Spin tip="Cargando información del router..." style={{ display: "block", textAlign: "center" }} />
        ) : (
          <Form
            form={form}
            layout="vertical"
            onFinish={handleSubmit}
            initialValues={{
              estado: "A",
            }}
          >
            <Row gutter={[16, 16]}>
              <Col xs={24} sm={24} md={12}>
                <Form.Item
                  name="nombre_router"
                  label="Nombre del Router"
                  rules={[{ required: true, message: "El nombre del router es obligatorio." }]}
                >
                  <Input placeholder="Ejemplo: Router Principal" />
                </Form.Item>
              </Col>
              <Col xs={24} sm={24} md={12}>
                <Form.Item
                  name="descripcion_router"
                  label="Descripción"
                  rules={[{ required: true, message: "La descripción es obligatoria." }]}
                >
                  <Input placeholder="Ejemplo: Router en la sucursal principal" />
                </Form.Item>
              </Col>

              <Col xs={24} sm={24} md={12}>
                <Form.Item
                  name="user"
                  label="Usuario"
                  rules={[{ required: true, message: "El usuario de conexión es obligatorio." }]}
                >
                  <Input placeholder="Ejemplo: admin" />
                </Form.Item>
              </Col>
              <Col xs={24} sm={24} md={12}>
                <Form.Item
                  name="password"
                  label="Contraseña"
                  rules={[{ required: true, message: "La contraseña es obligatoria." }]}
                >
                  <Input.Password placeholder="Contraseña del router" />
                </Form.Item>
              </Col>

              <Col xs={24} sm={24} md={12}>
                <Form.Item
                  name="ip"
                  label="Dirección IP"
                  rules={[
                    { required: true, message: "La dirección IP es obligatoria." },
                    { pattern: /^(?:[0-9]{1,3}\.){3}[0-9]{1,3}$/, message: "La dirección IP no es válida." },
                  ]}
                >
                  <Input placeholder="Ejemplo: 192.168.1.1" />
                </Form.Item>
              </Col>
              <Col xs={24} sm={24} md={12}>
                <Form.Item
                  name="port"
                  label="Puerto"
                  rules={[
                    { required: true, message: "El puerto es obligatorio." },
                    { pattern: /^[0-9]{1,5}$/, message: "El puerto debe ser un número válido." },
                  ]}
                >
                  <Input placeholder="Ejemplo: 8728" />
                </Form.Item>
              </Col>

              <Col xs={24} sm={24} md={12}>
                <Form.Item
                  name="latitud"
                  label="Latitud"
                  rules={[
                    { required: true, message: "La latitud es obligatoria." },
                    { pattern: /^-?\d{1,3}\.\d+$/, message: "La latitud debe ser un número decimal válido." },
                  ]}
                >
                  <Input placeholder="Ejemplo: -0.180653" />
                </Form.Item>
              </Col>
              <Col xs={24} sm={24} md={12}>
                <Form.Item
                  name="longitud"
                  label="Longitud"
                  rules={[
                    { required: true, message: "La longitud es obligatoria." },
                    { pattern: /^-?\d{1,3}\.\d+$/, message: "La longitud debe ser un número decimal válido." },
                  ]}
                >
                  <Input placeholder="Ejemplo: -78.467834" />
                </Form.Item>
              </Col>
            </Row>

            <Row justify="center" style={{ marginTop: "24px" }}>
              <Col>
                <Button
                  type="primary"
                  htmlType="submit"
                  loading={saving}
                  icon={<SaveOutlined />}
                  style={{
                    backgroundColor: "#f5222d",
                    borderColor: "#f5222d",
                  }}
                >
                  Guardar Cambios
                </Button>
                <Button
                  style={{ marginLeft: "16px" }}
                  onClick={() => navigate("/admin/routers")}
                >
                  Cancelar
                </Button>
              </Col>
            </Row>
          </Form>
        )}
      </Card>
    </div>
  );
}
