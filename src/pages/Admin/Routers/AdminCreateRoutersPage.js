import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Typography, Form, Input, Button, Row, Col, Card, message } from "antd";
import { PlusOutlined } from "@ant-design/icons";
import useAuth from "../../../hooks/useAuth";
import { crearRouter } from "../../../api/routers";

export default function AdminCreateRouterPage() {
  const [loading, setLoading] = useState(false);
  const [form] = Form.useForm();
  const navigate = useNavigate();
  const { user } = useAuth();

  const handleSubmit = async (values) => {
    try {
      setLoading(true);
      const token = user?.access_token;
      await crearRouter(values, token);
      message.success("Router creado exitosamente.");
      navigate("/admin/routers");
    } catch (error) {
      message.error(error.message || "Error al crear el router.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ padding: "16px", maxWidth: "1200px", margin: "0 auto" }}>
      <Typography.Title level={3} style={{ textAlign: "center", marginBottom: "24px" }}>
        Crear Router
      </Typography.Title>

      <Card style={{ padding: "24px", borderRadius: "8px" }}>
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
                loading={loading}
                icon={<PlusOutlined />}
                style={{
                  backgroundColor: "#f5222d",
                  borderColor: "#f5222d",
                }}
              >
                Crear Router
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
      </Card>
    </div>
  );
}
