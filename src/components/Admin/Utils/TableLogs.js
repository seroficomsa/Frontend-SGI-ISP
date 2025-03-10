import React, { useState } from "react";
import { Table, Badge, Typography, Button, Row, Col, Modal, Space, Spin } from "antd";
import { ReloadOutlined, EyeOutlined, LoadingOutlined } from "@ant-design/icons";
import moment from "moment";

export default function TableLogs({ logsData, loading, onRefresh }) {
    const [modalVisible, setModalVisible] = useState(false);
    const [selectedLog, setSelectedLog] = useState(null);

    // Función para abrir el modal con los detalles del log
    const showModal = (record) => {
        setSelectedLog(record);
        setModalVisible(true);
    };

    // Función para cerrar el modal
    const handleCloseModal = () => {
        setModalVisible(false);
        setSelectedLog(null);
    };

    const logsColumns = [
        {
            title: "N°",
            dataIndex: "index",
            key: "index",
            render: (_, __, index) => index + 1,
            responsive: ["md"], // Visible en pantallas medianas y grandes
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
                if (tipo === "Login") color = "green";
                else if (tipo === "Logout") color = "red";
                else if (tipo === "Creación") color = "blue";
                else if (tipo === "Router") color = "red";
                else if (tipo === "Plan") color = "orange";

                return <Badge color={color} text={tipo} />;
            },
        },
        {
            title: "Acción",
            dataIndex: "descripcion",
            key: "descripcion",
            render: (descripcion) => (
                <Typography.Text ellipsis={{ tooltip: descripcion }}>
                    {descripcion}
                </Typography.Text>
            ),
        },
        {
            title: "Hora",
            dataIndex: "fecha_creacion",
            key: "fecha_creacion",
            render: (fecha) => moment(fecha).format("DD/MM/YYYY HH:mm"),
        },
        {
            title: "Detalles",
            key: "details",
            render: (_, record) => (
                <Button
                    icon={<EyeOutlined style={{ color: "#ff4d4f" }} />}
                    type="default"
                    onClick={() => showModal(record)}
                    style={{
                        border: "2px solid #ff4d4f",
                        color: "#ff4d4f",
                        borderRadius: "8px",
                    }}
                />
            ),
        },
    ];

    // 🔴 Spinner Rojo (Para cuando se está cargando la tabla)
    const spinIcon = <LoadingOutlined style={{ fontSize: 24, color: "#ff4d4f" }} spin />;

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
            {/* Encabezado */}
            <Row justify="space-between" align="middle" style={{ marginBottom: "24px" }}>
                <Col>
                    <Typography.Title level={4} style={{ margin: 0, fontWeight: "bold" }}>
                        Registros
                    </Typography.Title>
                </Col>
                <Col>
                    <Button
                        icon={<ReloadOutlined style={{ color: "#ff4d4f" }} />}
                        type="default"
                        onClick={onRefresh}
                        style={{
                            borderRadius: "8px",
                            color: "#ff4d4f",
                            border: "2px solid #ff4d4f",
                            fontSize: "14px",
                            fontWeight: "500",
                        }}
                        size="middle"
                    >
                        Actualizar
                    </Button>
                </Col>
            </Row>

            {/* Tabla de registros con Spinner Rojo */}
            <Table
                dataSource={logsData}
                columns={logsColumns}
                loading={{ spinning: loading, indicator: spinIcon }}
                rowKey={(record) => record.id}
                pagination={{ pageSize: 5 }}
                style={{ background: "#ffffff", borderRadius: 8 }}
                scroll={{ x: "max-content" }} // Habilita el desplazamiento horizontal en móviles
            />

            {/* Modal de detalles */}
            <Modal
                title="Detalles del Registro"
                open={modalVisible}
                onCancel={handleCloseModal}
                footer={[
                    <Button
                        key="close"
                        type="default"
                        onClick={handleCloseModal}
                        style={{
                            border: "2px solid #ff4d4f",
                            color: "#ff4d4f",
                            borderRadius: "8px",
                        }}
                    >
                        OK
                    </Button>,
                ]}
            >
                {selectedLog && (
                    <Space direction="vertical" size="middle">
                        <Typography.Text strong>Descripción:</Typography.Text>
                        <Typography.Text>{selectedLog.descripcion}</Typography.Text>

                        <Typography.Text strong>Tipo de Acción:</Typography.Text>
                        <Badge
                            color={
                                selectedLog.tipo_accion === "Login" ? "green"
                                    : selectedLog.tipo_accion === "Logout" ? "red"
                                        : selectedLog.tipo_accion === "Creación" ? "blue"
                                            : selectedLog.tipo_accion === "Router" ? "red"
                                                : "orange"
                            }
                            text={selectedLog.tipo_accion}
                        />

                        <Typography.Text strong>Fecha y Hora:</Typography.Text>
                        <Typography.Text>
                            {moment(selectedLog.fecha_creacion).format("DD/MM/YYYY HH:mm")}
                        </Typography.Text>

                        {selectedLog.usuario && (
                            <>
                                <Typography.Text strong>Usuario:</Typography.Text>
                                <Typography.Text>
                                    {selectedLog.usuario.nombres} {selectedLog.usuario.apellidos} (
                                    <Typography.Text type="secondary">
                                        {selectedLog.usuario.correo_electronico}
                                    </Typography.Text>
                                    )
                                </Typography.Text>
                            </>
                        )}
                    </Space>
                )}
            </Modal>
        </div>
    );
}
