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
  InputNumber,
  Tag,
  message,
} from "antd";
import {
  PlusOutlined,
  EditOutlined,
  DeleteOutlined,
  SyncOutlined,
  SearchOutlined,
  EyeOutlined,
} from "@ant-design/icons";
import useAuth from "../../../hooks/useAuth";
import {
  obtenerOLTs,
  crearOLT,
  actualizarOLT,
  eliminarOLT,
} from "../../../api/olts";
import { obtenerRouters } from "../../../api/routers";
import { useNavigate } from "react-router-dom";

const { Option } = Select;

export default function AdminOLTsPage() {
  const [olts, setOLTs] = useState([]);
  const [routers, setRouters] = useState([]);
  const [filteredOLTs, setFilteredOLTs] = useState([]);
  const [loading, setLoading] = useState(false);
  const [search, setSearch] = useState("");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingOLT, setEditingOLT] = useState(null);
  const [form] = Form.useForm();
  const { user } = useAuth();


  const navigate = useNavigate();


  const fetchOLTs = async () => {
    setLoading(true);
    try {
      const token = user?.access_token;
      const response = await obtenerOLTs(token);
      if (response?.data && Array.isArray(response.data)) {
        setOLTs(response.data);
        setFilteredOLTs(response.data);
      } else {
        setOLTs([]);
        console.error("Error: La API no devolvió un array de OLTs.");
      }
    } catch (error) {
      message.error("Error al obtener las OLTs.");
      setOLTs([]);
    } finally {
      setLoading(false);
    }
  };

  const fetchRouters = async () => {
    try {
      const token = user?.access_token;
      const response = await obtenerRouters(token);
      if (response?.data && Array.isArray(response.data)) {
        setRouters(response.data);
      } else {
        setRouters([]);
        console.error("Error: La API no devolvió un array de routers.");
      }
    } catch (error) {
      message.error("Error al obtener routers.");
      setRouters([]);
    }
  };

  useEffect(() => {
    fetchOLTs();
    fetchRouters();
  }, []);

  const handleSearch = (e) => {
    const value = e.target.value.toLowerCase();
    setSearch(value);
    const filtered = olts.filter((olt) =>
      olt.nombre_olt.toLowerCase().includes(value)
    );
    setFilteredOLTs(filtered);
  };

  const handleCreateOrUpdate = async (values) => {
    try {
      const token = user?.access_token;
      values.estado = "A"; // Siempre en estado "A"

      if (editingOLT) {
        values.id_olt = editingOLT.id_olt;
        await actualizarOLT(values, token);
        message.success("OLT actualizada exitosamente.");
      } else {
        await crearOLT(values, token);
        message.success("OLT creada exitosamente.");
      }
      setIsModalOpen(false);
      form.resetFields();
      fetchOLTs();
    } catch (error) {
      message.error("Error al guardar la OLT.");
    }
  };

  const handleDelete = async (id_olt) => {
    try {
      const token = user?.access_token;
      await eliminarOLT(id_olt, token);
      message.success("OLT eliminada exitosamente.");
      fetchOLTs();
    } catch (error) {
      message.error("Error al eliminar la OLT.");
    }
  };

  const columns = [
    {
      title: "Nombre de la OLT",
      dataIndex: "nombre_olt",
      key: "nombre_olt",
    },
    {
      title: "Descripción",
      dataIndex: "descripcion_olt",
      key: "descripcion_olt",
    },
    {
      title: "IP OLT",
      dataIndex: "ip_olt",
      key: "ip_olt",
    },
    {
      title: "Estado",
      key: "estado_olt",
      render: (_, record) => (
        <Tag color={record.estado_olt === "Activo" ? "green" : "red"}>
          {record.estado_olt}
        </Tag>
      ),
    },
    {
      title: "Acciones",
      key: "acciones",
      width: "120px", // Fijar el ancho de la columna
      fixed: "right",
      render: (_, record) => (
        <div style={{ display: "flex", justifyContent: "center", gap: "20px" }}>
          <EyeOutlined
            style={{ color: "#FF4D4F", fontSize: "16px", cursor: "pointer" }}
            onClick={() => navigate(`/admin/olts/${record.id_olt}`)}
            
          />
          <EditOutlined
            style={{ color: "#FF4D4F", fontSize: "16px", cursor: "pointer" }}
            onClick={() => {
              setEditingOLT(record);
              form.setFieldsValue(record);
              setIsModalOpen(true);
            }}
          />
          <DeleteOutlined
            style={{ color: "#FF4D4F", fontSize: "16px", cursor: "pointer" }}
            onClick={() => handleDelete(record.id_olt)}
          />
        </div>
      ),
    },
  ];
  
  return (
    <div style={{ background: "#fff", padding: "16px", borderRadius: "8px" }}>
      <Row justify="space-between" align="middle" style={{ marginBottom: "24px" }}>
        <Col>
          <Typography.Title level={4} style={{ margin: 0, fontWeight: "bold", color: "#FF4D4F" }}>
            OLTs ({filteredOLTs.length})
          </Typography.Title>
        </Col>
        <Col>
          <Space>
            <Button
              icon={<SyncOutlined />}
              onClick={fetchOLTs}
              loading={loading}
              style={{
                borderRadius: "8px",
                borderColor: "#FF4D4F",
                color: "#FF4D4F",
                fontWeight: "bold",
              }}
            >
              Actualizar
            </Button>
            <Button
              type="primary"
              icon={<PlusOutlined />}
              onClick={() => {
                setEditingOLT(null);
                form.resetFields();
                setIsModalOpen(true);
              }}
              style={{
                backgroundColor: "#FF4D4F",
                borderColor: "#FF4D4F",
                fontWeight: "bold",
                color: "white",
              }}
            >
              Crear OLT
            </Button>
          </Space>
        </Col>
      </Row>

      <Input
        placeholder="Buscar OLT..."
        prefix={<SearchOutlined />}
        value={search}
        onChange={handleSearch}
        style={{ marginBottom: "16px", width: "100%" }}
      />

      <Table
        dataSource={filteredOLTs}
        columns={columns}
        rowKey="id_olt"
        loading={loading}
        pagination={{ pageSize: 10 }}
        bordered
        scroll={{ x: true }}
      />

      <Modal
        title={editingOLT ? "Editar OLT" : "Crear OLT"}
        open={isModalOpen}
        onCancel={() => {
          setIsModalOpen(false);
          form.resetFields();
        }}
        onOk={() => form.submit()}
        okButtonProps={{ style: { backgroundColor: "#FF4D4F", borderColor: "#FF4D4F", color: "white" } }}
        cancelButtonProps={{ style: { borderColor: "#FF4D4F", color: "#FF4D4F" } }}
      >
        <Form form={form} layout="vertical" onFinish={handleCreateOrUpdate}>
          <Form.Item name="id_router" label="Router" rules={[{ required: true }]}>
            <Select placeholder="Seleccione un router">
              {routers.map((router) => (
                <Option key={router.id_router} value={router.id_router}>
                  {router.nombre_router}
                </Option>
              ))}
            </Select>
          </Form.Item>
          <Form.Item name="nombre_olt" label="Nombre de la OLT" rules={[{ required: true }]}>
            <Input />
          </Form.Item>
          <Form.Item name="descripcion_olt" label="Descripción">
            <Input.TextArea />
          </Form.Item>
          <Form.Item name="ip_olt" label="IP OLT" rules={[{ required: true }]}>
            <Input />
          </Form.Item>
          <Form.Item name="user_olt" label="Usuario SSH" rules={[{ required: true }]}>
            <Input />
          </Form.Item>
          <Form.Item name="passw_olt" label="Contraseña SSH" rules={[{ required: true }]}>
            <Input.Password />
          </Form.Item>
          <Form.Item name="port_olt" label="Puerto SSH" initialValue={22}>
            <InputNumber style={{ width: "100%" }} />
          </Form.Item>
        </Form>
      </Modal>

        {/* Estilos responsivos */}
        <style>
        {`
          @media (max-width: 768px) {
            .row-header {
              flex-direction: column;
              align-items: flex-start;
              gap: 16px;
            }
            .row-header .ant-space {
              width: 100%;
              justify-content: flex-start;
            }
          }
        `}
      </style>
    </div>
  );
}