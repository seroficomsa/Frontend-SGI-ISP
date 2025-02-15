import React from "react";
import { Table, Badge, Typography, Button, Row, Col } from "antd";
import { ReloadOutlined, WarningOutlined } from "@ant-design/icons";
import moment from "moment";

export default function TableLogs({ logsData, loading, onRefresh }) {
    const logsColumns = [
        {
            title: "N°",
            dataIndex: "index",
            key: "index",
            render: (_, __, index) => index + 1,
            responsive: ["md"], // Solo se muestra en pantallas medianas y grandes
        },
        {
            title: "Descripción",
            dataIndex: "descripcion",
            key: "descripcion",
            render: (descripcion) => (
                <Typography.Text ellipsis={{ tooltip: descripcion }}>
                    {descripcion}
                </Typography.Text>
            ),
        },
        {
            title: "Usuario",
            dataIndex: "usuario",
            key: "usuario",
            render: (usuario) =>
                usuario && (
                    <Typography.Text ellipsis style={{ fontSize: "12px" }}>
                        {usuario.nombres} {usuario.apellidos} (
                        <Typography.Text type="secondary">{usuario.correo_electronico}</Typography.Text>)
                    </Typography.Text>
                ),
        },
        {
            title: "Tipo",
            dataIndex: "tipo_accion",
            key: "tipo_accion",
            filters: [
                { text: "Login", value: "Login" },
                { text: "Logout", value: "Logout" },
                { text: "Creación", value: "Creación" },
                { text: "Router", value: "Router" },
                { text: "Plan", value: "Plan" }
            ],
            onFilter: (value, record) => record.tipo_accion === value,
            render: (tipo) => {
                let color;
                let icon;
                if (tipo === "Login") {
                    color = "green";
                } else if (tipo === "Logout") {
                    color = "red";
                } else if (tipo === "Creación") {
                    color = "blue";
                } else if (tipo === "Router") {
                    color = "red";
                    // icon = <WarningOutlined style={{ color: "#f5222d", marginRight: "5px" }} />;
                }
                else if (tipo === "Plan") {
                    color = "orange";
                    // icon = <WarningOutlined style={{ color: "#f5222d", marginRight: "5px" }} />;
                }

                return (
                    <span>
                        {icon}
                        <Badge color={color} text={tipo === "Router" ? "Router" : tipo} />
                    </span>
                );
            },
        },
        {
            title: "Hora",
            dataIndex: "fecha_creacion",
            key: "fecha_creacion",
            render: (fecha) => moment(fecha).format("DD/MM/YYYY HH:mm"),
        },
    ];

    return (
        <div
            style={{
                marginTop: "16px",
                padding: "16px",
                background: "#ffffff",
                borderRadius: "8px",
                boxShadow: "0px 4px 8px rgba(0, 0, 0, 0.1)",
            }}
        >
            <Row justify="space-between" align="middle" style={{ marginBottom: "24px" }}>
                <Col>
                    <Typography.Title level={4} style={{ margin: 0, fontWeight: "bold" }}>
                        Registros
                    </Typography.Title>
                </Col>
                <Col>
                    <Button
                        icon={<ReloadOutlined />}
                        type="primary"
                        onClick={onRefresh}
                        style={{
                            borderRadius: "8px",
                            backgroundColor: "#1677ff",
                            borderColor: "#1677ff",
                            fontSize: "14px",
                            fontWeight: "500",
                        }}
                        size="middle"
                    >
                        Actualizar
                    </Button>
                </Col>
            </Row>
            <Table
                dataSource={logsData}
                columns={logsColumns}
                loading={loading}
                rowKey={(record) => record.id}
                pagination={{ pageSize: 5 }}
                style={{
                    background: "#ffffff",
                    borderRadius: 8,
                }}
                rowClassName={(record) =>
                    record.tipo_accion === "Router"
                        ? "router-disconnected-row"
                        : ""
                } // Clase para destacar las filas de desconexión
                scroll={{ x: "max-content" }} // Habilita el desplazamiento horizontal en móviles
            />
        </div>
    );
}
