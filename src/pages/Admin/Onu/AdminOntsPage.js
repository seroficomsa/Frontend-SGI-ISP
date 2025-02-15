
import React, { useState, useEffect } from "react";
import {
    Typography,
    Button,
    Table,
    Space,
    Input,
    Row,
    Col,
    Modal,
    Form,
    Select,
    Tag,
    message,
} from "antd";
import {
    PlusOutlined,
    EditOutlined,
    DeleteOutlined,
    SyncOutlined,
    SearchOutlined,
} from "@ant-design/icons";
import useAuth from "../../../hooks/useAuth";
import {
    obtenerOnts,
    crearOnt,
    actualizarOnt,
    eliminarOnt,
} from "../../../api/onts"; // Cambiado a ont

const { Option } = Select;

export default function AdminOntsPage() {
    const [onts, setOnts] = useState([]);
    const [filteredOnts, setFilteredOnts] = useState([]);
    const [loading, setLoading] = useState(false);
    const [search, setSearch] = useState("");
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [editingOnt, setEditingOnt] = useState(null);
    const [form] = Form.useForm();
    const { user } = useAuth();

    // Modelos disponibles
    const modelos = ["XC220-G3v(US1)", "HG8245H", "ZXHN F680"];

    // Cargar ONTs desde la API
    const fetchOnts = async () => {
        setLoading(true);
        try {
            const token = user?.access_token;
            const response = await obtenerOnts(token);
            if (response?.data && Array.isArray(response.data)) {
                const updatedOnts = response.data.map(ont => ({
                    ...ont,
                    estado: ont.enuso ? "En uso" : ont.estado === "A" ? "Libre" : "Eliminado"
                }));
                setOnts(updatedOnts);
                setFilteredOnts(updatedOnts);
            } else {
                setOnts([]);
                console.error("Error: La API no devolvió un array de ONTs.");
            }
        } catch (error) {
            message.error("Error al obtener las ONTs.");
            setOnts([]);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchOnts();
    }, []);

    // Filtrar ONTs por búsqueda
    const handleSearch = (e) => {
        const value = e.target.value.toLowerCase();
        setSearch(value);
        const filtered = onts.filter((ont) =>
            ont.modelo.toLowerCase().includes(value) ||
            ont.sn.toLowerCase().includes(value) ||
            ont.gpon_sn.toLowerCase().includes(value) ||
            ont.mac.toLowerCase().includes(value)
        );
        setFilteredOnts(filtered);
    };

    // Crear o actualizar una ONT
    const handleCreateOrUpdate = async (values) => {
        try {
            const token = user?.access_token;
            if (editingOnt) {
                values.id_ont = editingOnt.id_ont;
                await actualizarOnt(values, token);
                message.success("ONT actualizada exitosamente.");
            } else {
                await crearOnt(values, token);
                message.success("ONT creada exitosamente.");
            }
            setIsModalOpen(false);
            form.resetFields();
            fetchOnts();
        } catch (error) {
            message.error("Error al guardar la ONT.");
        }
    };

    // Eliminar una ONT
    const handleDelete = async (id_ont) => {
        try {
            const token = user?.access_token;
            await eliminarOnt(id_ont, token);
            message.success("ONT eliminada exitosamente.");
            fetchOnts();
        } catch (error) {
            message.error("Error al eliminar la ONT.");
        }
    };


    const handleMacChange = (e) => {
        form.setFieldsValue({ mac: formatMacAddress(e.target.value) });
    };

      // Formatear automáticamente la dirección MAC (XX-XX-XX-XX-XX-XX)
      const formatMacAddress = (value) => {
        let mac = value.replace(/[^A-Fa-f0-9]/g, "").toUpperCase(); // Solo hex y mayúsculas
        let formattedMac = mac.match(/.{1,2}/g)?.join("-") || "";
        return formattedMac.length > 17 ? formattedMac.slice(0, 17) : formattedMac;
    };

    // Definir las columnas de la tabla
    const columns = [
        {
            title: "Modelo",
            dataIndex: "modelo",
            key: "modelo",
        },
        {
            title: "SN",
            dataIndex: "sn",
            key: "sn",
        },
        {
            title: "GPON SN",
            dataIndex: "gpon_sn",
            key: "gpon_sn",
        },
        {
            title: "MAC",
            dataIndex: "mac",
            key: "mac",
        },
        {
            title: "Estado",
            dataIndex: "estado",
            key: "estado",
            render: (estado) => (
                <Tag color={estado === "Libre" ? "green" : estado === "En uso" ? "gold" : "red"}>
                    {estado}
                </Tag>
            ),
        },
        {
            title: "Acciones",
            key: "acciones",
            render: (_, record) => (
                <Space>
                    <Button
                        icon={<EditOutlined />}
                        onClick={() => {
                            setEditingOnt(record);
                            form.setFieldsValue(record);
                            setIsModalOpen(true);
                        }}
                        style={{ borderColor: "#FF4D4F", color: "#FF4D4F", background: "white" }}
                    />
                    <Button
                        icon={<DeleteOutlined />}
                        danger
                        onClick={() => handleDelete(record.id_ont)}
                        style={{ borderColor: "#FF4D4F", color: "white", background: "#FF4D4F" }}
                    />
                </Space>
            ),
        },
    ];

    return (
        <div style={{ background: "#fff", padding: "16px", borderRadius: "8px" }}>
            <Row justify="space-between" align="middle" style={{ marginBottom: "24px" }}>
                <Col>
                    <Typography.Title level={4} style={{ margin: 0, fontWeight: "bold", color: "#FF4D4F" }}>
                        ONTs ({filteredOnts.length})
                    </Typography.Title>
                </Col>
                <Col>
                    <Space>
                        <Button icon={<SyncOutlined />} onClick={fetchOnts} loading={loading} style={{ borderColor: "#FF4D4F", color: "#FF4D4F" }}>
                            Actualizar
                        </Button>
                        <Button type="primary" icon={<PlusOutlined />} onClick={() => { setEditingOnt(null); form.resetFields(); setIsModalOpen(true); }}
                            style={{ backgroundColor: "#FF4D4F", borderColor: "#FF4D4F", color: "white" }}>
                            Crear ONT
                        </Button>
                    </Space>
                </Col>
            </Row>

            <Input placeholder="Buscar ONT..." prefix={<SearchOutlined />} value={search} onChange={handleSearch}
                style={{ marginBottom: "16px", width: "100%" }} />

            <Table dataSource={filteredOnts} columns={columns} rowKey="id_ont" loading={loading} pagination={{ pageSize: 10 }} bordered />

            <Modal okButtonProps={{ style: { backgroundColor: "#ff4d4f", borderColor: "#ff4d4f" } }}
                title={editingOnt ? "Editar ONT" : "Crear ONT"} open={isModalOpen} onCancel={() => { setIsModalOpen(false); form.resetFields(); }} onOk={() => form.submit()}>
                <Form form={form} layout="vertical" onFinish={handleCreateOrUpdate}>
                    <Form.Item name="modelo" label="Modelo" rules={[{ required: true }]}>
                        <Select placeholder="Seleccione un modelo">{modelos.map((modelo) => (<Option key={modelo} value={modelo}>{modelo}</Option>))}</Select>
                    </Form.Item>
                    <Form.Item name="sn" label="SN" rules={[{ required: true }]}><Input /></Form.Item>
                    <Form.Item name="gpon_sn" label="GPON SN" rules={[{ required: true }]}><Input /></Form.Item>
                    <Form.Item name="mac" label="MAC" rules={[{ required: true }]}><Input onChange={handleMacChange} maxLength={17} /></Form.Item>
                </Form>
            </Modal>
        </div>
    );
}