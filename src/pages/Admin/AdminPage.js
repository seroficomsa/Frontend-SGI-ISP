import React, { useEffect, useState } from "react";
import { Row, Col, Card, Typography, Skeleton, message } from "antd";
import {
  UserOutlined,
  TeamOutlined,
  FileTextOutlined,
  BarChartOutlined,
  DatabaseOutlined,
} from "@ant-design/icons";
import TableLogs from "../../components/Admin/Utils/TableLogs";
import { obtenerLogs } from "../../api/logs";
import useAuth from "../../hooks/useAuth";

const ModernDashboard = () => {
  useEffect(() => {
    document.title = "Admin - OLTS | SEROFICOM";
  }, []);

  const [logsData, setLogsData] = useState([]);
  const [loadingLogs, setLoadingLogs] = useState(true); // Estado de carga para logs
  const [loadingCards, setLoadingCards] = useState(true); // Estado de carga para las Cards
  const { user } = useAuth();

  // 🔹 Datos de las Cards (Estadísticas)
  const statistics = [
    {
      title: "Clientes",
      value: 1200,
      color: "#1890ff",
      icon: <TeamOutlined style={{ fontSize: 32, color: "#1890ff" }} />,
    },
    {
      title: "Planes Activos",
      value: 45,
      color: "#52c41a",
      icon: <DatabaseOutlined style={{ fontSize: 32, color: "#52c41a" }} />,
    },
    {
      title: "Routers en Red",
      value: 100,
      color: "#faad14",
      icon: <BarChartOutlined style={{ fontSize: 32, color: "#faad14" }} />,
    },
    {
      title: "OLTs en Gestión",
      value: 10,
      color: "#ff4d4f",
      icon: <FileTextOutlined style={{ fontSize: 32, color: "#ff4d4f" }} />,
    },
  ];

  // 🔹 Obtener los Logs desde la API (Solo Logs)
  const fetchLogs = async () => {
    if (!user) return;
    setLoadingLogs(true);
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
      setLoadingLogs(false);
    }
  };

  // 🔹 Obtener Datos de las Cards (Inicialmente)
  useEffect(() => {
    const fetchData = async () => {
      setLoadingCards(true);
      await fetchLogs();
      setLoadingCards(false);
    };
    fetchData();
  }, [user]);

  return (
    <div style={{ padding: "5px" }}>
      <Typography.Title level={3} style={{ marginBottom: 24 }}>
        Resumen General
      </Typography.Title>

      {/* 🔹 Cards de Resumen */}
      <Row gutter={[16, 16]}>
        {statistics.map((stat, index) => (
          <Col xs={24} sm={12} md={8} lg={6} key={index}>
            <Card
              bordered
              hoverable
              style={{
                textAlign: "center",
                borderRadius: 12,
                boxShadow: "0px 4px 10px rgba(0, 0, 0, 0.1)",
                background: "#fff",
                transition: "all 0.3s ease-in-out",
              }}
            >
              <div style={{ fontSize: 40, marginBottom: 10 }}>{stat.icon}</div>
              <Typography.Title level={2} style={{ color: stat.color, margin: 0 }}>
                {loadingCards ? <Skeleton.Button active /> : stat.value}
              </Typography.Title>
              <Typography.Text type="secondary">{stat.title}</Typography.Text>
            </Card>
          </Col>
        ))}
      </Row>

      {/* 🔹 Tabla de Logs */}
      <TableLogs logsData={logsData} loading={loadingLogs} onRefresh={fetchLogs} />
    </div>
  );
};

export default ModernDashboard;
