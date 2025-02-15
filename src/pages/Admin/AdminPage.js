import React, { useEffect, useState } from "react";
import { Row, Col, Card, Typography, message } from "antd";
import {
  UserOutlined,
  TeamOutlined,
  FileTextOutlined,
  BarChartOutlined,
  QuestionCircleOutlined,
} from "@ant-design/icons";
import TableLogs from "../../components/Admin/Utils/TableLogs";
import { obtenerLogs } from "../../api/logs";
import useAuth from "../../hooks/useAuth";

export default function ModernDashboard() {
  const [logsData, setLogsData] = useState([]);
  const [loading, setLoading] = useState(false);
  const { user } = useAuth();

  // Estadísticas simuladas
  const statistics = [
    {
      title: "Clientes Totales",
      value: 1200,
      color: "#1890ff",
      icon: <TeamOutlined style={{ fontSize: 24, color: "#1890ff" }} />,
    },
    {
      title: "Clientes Activos",
      value: 1100,
      color: "#52c41a",
      icon: <UserOutlined style={{ fontSize: 24, color: "#52c41a" }} />,
    },
    {
      title: "Clientes Cortados",
      value: 100,
      color: "#ff4d4f",
      icon: <FileTextOutlined style={{ fontSize: 24, color: "#ff4d4f" }} />,
    },
    {
      title: "Facturas Generadas",
      value: 800,
      color: "#faad14",
      icon: <BarChartOutlined style={{ fontSize: 24, color: "#faad14" }} />,
    },
    {
      title: "Soportes Generados",
      value: 300,
      color: "#722ed1",
      icon: <QuestionCircleOutlined style={{ fontSize: 24, color: "#722ed1" }} />,
    },
  ];

  // Obtiene los logs desde la API
  const fetchLogs = async () => {
    if (!user) return;
    setLoading(true);
    try {
      const token = user.access_token;
      const response = await obtenerLogs(token);
      if (response.success) {
        setLogsData(response.data);
      } else {
        message.error("Error al obtener los registros.");
      }
    } catch (error) {
      message.error("Ocurrió un error al obtener los registros.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchLogs();
  }, [user]);

  return (
    <div >
      <Typography.Title level={4} style={{ marginBottom: 24 }}>
        Resumen General
      </Typography.Title>
      <Row gutter={[16, 16]}>
        {statistics.map((stat, index) => (
          <Col xs={24} sm={12} md={8} lg={6} key={index}>
            <Card
              bordered
              style={{
                textAlign: "center",
                borderRadius: 8,
                transition: "all 0.3s ease",
              }}
              hoverable
            >
              <div
                style={{
                  display: "flex",
                  justifyContent: "center",
                  alignItems: "center",
                  marginBottom: 12,
                }}
              >
                {stat.icon}
              </div>
              <Typography.Title
                level={3}
                style={{ color: stat.color, margin: 0 }}
              >
                {stat.value}
              </Typography.Title>
              <Typography.Text type="secondary">{stat.title}</Typography.Text>
            </Card>
          </Col>
        ))}
      </Row>

      <TableLogs logsData={logsData} loading={loading} onRefresh={fetchLogs} />
    </div>
  );
}
