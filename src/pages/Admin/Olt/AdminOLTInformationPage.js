import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import {
  Typography,
  Card,
  Descriptions,
  Badge,
  Skeleton,
  Alert,
  Row,
  Col,
  Button,
} from "antd";
import { LeftOutlined, CalendarOutlined, ClockCircleOutlined } from "@ant-design/icons";
import { obtenerOLT } from "../../../api/olts";
import useAuth from "../../../hooks/useAuth";
import moment from "moment";

export default function AdminOLTInformationPage() {
  const { id_olt } = useParams();
  const navigate = useNavigate();
  const [olt, setOlt] = useState(null);
  const [loading, setLoading] = useState(true);
  const { user } = useAuth();

  useEffect(() => {
    const fetchOLT = async () => {
      try {
        const token = user?.access_token;
        const numericId = parseInt(id_olt, 10);
        if (isNaN(numericId)) {
          throw new Error("ID de OLT no es un número válido.");
        }

        const response = await obtenerOLT(numericId, token);
        if (response) {
          setOlt(response);
        } else {
          throw new Error("No se encontró información de la OLT.");
        }
      } catch (error) {
        console.error("Error al obtener la OLT:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchOLT();
  }, [id_olt, user]);

  if (!olt && !loading) {
    return (
      <Alert
        message="No se encontró información de la OLT."
        type="error"
        showIcon
        style={{ textAlign: "center", marginTop: 50 }}
      />
    );
  }

  return (
    <div style={{ maxWidth: "1100px", margin: "auto", padding: "20px" }}>
      {/* Botón Volver con mejor alineación y diseño */}
      <div style={{ marginBottom: "15px", textAlign: "left" }}>
        <Button
          type="primary"
          icon={<LeftOutlined />}
          onClick={() => navigate(-1)}
          style={{
            backgroundColor: "#FF4D4F",
            color: "white",
            borderRadius: "8px",
            fontWeight: "bold",
            padding: "10px 20px",
            cursor: "pointer",
            border: "none",
          }}
        >
          Volver
        </Button>
      </div>

      {/* Logo centrado */}
      <div style={{ display: "flex", justifyContent: "center", marginTop: "40px"}}>
        <img
          src="https://upload.wikimedia.org/wikipedia/commons/a/a7/Tp-Link_logo_2016.png"
          alt="TP-Link Logo"
          style={{ width: "230px", maxWidth: "60%", marginBottom: "20px" }}
        />
      </div>

      {/* Sección de Tarjetas con Skeleton en carga */}
      <Row gutter={[24, 24]} justify="center">
        
        {/* Tarjeta 1 - Información de la OLT */}
        <Col xs={24} sm={24} md={12}>
          <Card
            bordered={false}
            style={{
              borderRadius: "12px",
              boxShadow: "0px 8px 16px rgba(0, 0, 0, 0.05)",
              padding: "30px",
              textAlign: "center",
              background: "#fff",
            }}
          >
            <Typography.Title level={4} style={{ color: "#FF4D4F", fontWeight: "bold", marginBottom: "20px" }}>
              Información de la OLT
            </Typography.Title>

            {loading ? (
              <Skeleton active paragraph={{ rows: 6 }} />
            ) : (
              <Descriptions column={1} bordered size="middle" layout="vertical">
                <Descriptions.Item label="Nombre">
                  <Typography.Text strong>{olt.nombre_olt}</Typography.Text>
                </Descriptions.Item>
                <Descriptions.Item label="Ubicación">{olt.data_otl.location}</Descriptions.Item>
                <Descriptions.Item label="IP">
                  <Typography.Text strong style={{ color: "#1890ff" }}>{olt.ip_olt}</Typography.Text>
                </Descriptions.Item>
                <Descriptions.Item label="Estado">
                  <Badge status={olt.estado === "A" ? "success" : "error"} text={olt.estado === "A" ? "Activo" : "Inactivo"} />
                </Descriptions.Item>
                <Descriptions.Item label="Fecha de Creación">
                  <CalendarOutlined /> {moment(olt.fecha_creacion).format("DD/MM/YYYY HH:mm")}
                </Descriptions.Item>
                <Descriptions.Item label="Última Actualización">
                  <ClockCircleOutlined /> {moment(olt.fecha_actualizacion).format("DD/MM/YYYY HH:mm")}
                </Descriptions.Item>
              </Descriptions>
            )}
          </Card>
        </Col>

        {/* Tarjeta 2 - Información de Versión & Tiempo */}
        <Col xs={24} sm={24} md={12}>
          <Card
            bordered={false}
            style={{
              borderRadius: "12px",
              boxShadow: "0px 8px 16px rgba(0, 0, 0, 0.05)",
              padding: "30px",
              textAlign: "center",
              background: "#fff",
            }}
          >
            <Typography.Title level={4} style={{ color: "#FF4D4F", fontWeight: "bold", marginBottom: "20px" }}>
              Versión & Tiempo
            </Typography.Title>

            {loading ? (
              <Skeleton active paragraph={{ rows: 6 }} />
            ) : (
              <Descriptions column={1} bordered size="middle" layout="vertical">
                <Descriptions.Item label="Versión de Hardware">
                  <Typography.Text strong>{olt.data_otl.hardware_version}</Typography.Text>
                </Descriptions.Item>
                <Descriptions.Item label="Versión de Firmware">
                  <Typography.Text>{olt.data_otl.software_version}</Typography.Text>
                </Descriptions.Item>
                <Descriptions.Item label="Boot Loader">
                  <Typography.Text strong>{olt.data_otl.bootloader_version}</Typography.Text>
                </Descriptions.Item>
                <Descriptions.Item label="MAC Address">
                  <Typography.Text>{olt.data_otl.mac_address}</Typography.Text>
                </Descriptions.Item>
                <Descriptions.Item label="Número de Serie">
                  <Typography.Text>{olt.data_otl.serial_number}</Typography.Text>
                </Descriptions.Item>
                <Descriptions.Item label="Hora del Sistema">
                  <CalendarOutlined /> {olt.data_otl.system_time}
                </Descriptions.Item>
                <Descriptions.Item label="Tiempo en Ejecución">
                  <Typography.Text strong>{olt.data_otl.running_time}</Typography.Text>
                </Descriptions.Item>
              </Descriptions>
            )}
          </Card>
        </Col>

      </Row>
    </div>
  );
}
