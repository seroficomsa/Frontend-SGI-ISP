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
  ToolOutlined,
} from "@ant-design/icons";
import useAuth from "../../../hooks/useAuth";
import {
  listarPlanes,
  crearPlan,
  actualizarPlan,
  eliminarPlan,
  repararPlan,
} from "../../../api/plans";
import { obtenerRouters } from "../../../api/routers";
import { listarIPPools } from "../../../api/ippools"; // Importar la función para listar IP Pools

const { Option } = Select;

export default function AdminPlanesPage() {
  const [planes, setPlanes] = useState([]);
  const [routers, setRouters] = useState([]);
  const [ippools, setIPPools] = useState([]); // Estado para almacenar los IP Pools
  const [filteredPlanes, setFilteredPlanes] = useState([]);
  const [loading, setLoading] = useState(false);
  const [search, setSearch] = useState("");
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [editingPlan, setEditingPlan] = useState(null);
  const [form] = Form.useForm();
  const { user } = useAuth();

  const fetchPlanes = async () => {
    setLoading(true);
    try {
      const token = user?.access_token;
      const response = await listarPlanes(token);
      if (response?.data) {
        setPlanes(response.data);
        setFilteredPlanes(response.data);
      }
    } catch (error) {
      console.error("Error al obtener planes:", error);
      message.error("Error al obtener planes.");
    } finally {
      setLoading(false);
    }
  };

  const fetchRouters = async () => {
    try {
      const token = user?.access_token;
      const response = await obtenerRouters(token);
      if (response?.data) {
        setRouters(response.data);
      }
    } catch (error) {
      console.error("Error al obtener routers:", error);
      message.error("Error al obtener routers.");
    }
  };

  const fetchIPPools = async () => {
    try {
      const token = user?.access_token;
      const response = await listarIPPools(token);
      if (response?.data) {
        setIPPools(response.data);
      }
    } catch (error) {
      console.error("Error al obtener IP Pools:", error);
      message.error("Error al obtener IP Pools.");
    }
  };

  useEffect(() => {
    fetchPlanes();
    fetchRouters();
    fetchIPPools();
  }, []);

  const handleSearch = (e) => {
    const value = e.target.value.toLowerCase();
    setSearch(value);
    const filtered = planes.filter((plan) =>
      plan.nombre_plan.toLowerCase().includes(value)
    );
    setFilteredPlanes(filtered);
  };

  const handleCreateOrUpdate = async (values) => {
    try {
      const token = user?.access_token;
      if (editingPlan) {
        const response = await actualizarPlan(editingPlan.id_plan, values, token);
        if (response.success) {
          message.success("Plan actualizado exitosamente.");
        } else {
          message.error(response.message || "No se pudo actualizar el plan.");
        }
      } else {
        await crearPlan(values, token);
        message.success("Plan creado exitosamente.");
      }
      setIsCreateModalOpen(false);
      setIsEditModalOpen(false);
      form.resetFields();
      fetchPlanes();
    } catch (error) {
      console.error("Error al guardar el plan:", error);
      message.error(error.response?.data?.message || "No se pudo guardar el plan.");
    }
  };

  const handleDelete = async (id) => {
    try {
      const token = user?.access_token;
      await eliminarPlan(id, token);
      message.success("Plan eliminado exitosamente.");
      fetchPlanes();
    } catch (error) {
      console.error("Error al eliminar el plan:", error);
      message.error("No se pudo eliminar el plan.");
    }
  };

  const handleRepair = async (idPlan) => {
    try {
      const token = user?.access_token;
      const response = await repararPlan(idPlan, token);
      message.success(response.message);
      fetchPlanes();
    } catch (error) {
      console.error("Error al reparar el plan:", error);
      message.error("No se pudo reparar el plan.");
    }
  };

  const handleRepairAll = async () => {
    const plansToRepair = planes.filter(plan => plan.estado_mikrotik === "No Existe");
    if (plansToRepair.length === 0) {
      message.info("No hay planes para reparar.");
      return;
    }

    try {
      const token = user?.access_token;
      for (const plan of plansToRepair) {
        await repararPlan(plan.id_plan, token);
      }
      message.success("Todos los planes han sido reparados.");
      fetchPlanes();
    } catch (error) {
      console.error("Error al reparar los planes:", error);
      message.error("No se pudieron reparar todos los planes.");
    }
  };

  const columns = [
    {
      title: "Nombre del Plan",
      dataIndex: "nombre_plan",
      key: "nombre_plan",
    },
    {
      title: "Descripción",
      dataIndex: "descripcion_plan",
      key: "descripcion_plan",
    },
    {
      title: "Precio",
      dataIndex: "precio",
      key: "precio",
      render: (precio) => `$ ${precio}`,
    },
    {
      title: "Velocidad",
      key: "velocidad",
      render: (record) => `${record.mb_subida} Mbps / ${record.mb_bajada} Mbps`,
    },
    {
      title: "Router",
      key: "router",
      render: (_, record) => (
        <Typography.Text strong>
          {record.router?.nombre_router || "Sin router"}
        </Typography.Text>
      ),
    },
    {
      title: "Pool",
      key: "ippool",
      render: (_, record) => (
        <Typography.Text strong>
          {record.ippool?.nombre_pool || "Sin IP Pool"}
        </Typography.Text>
      ),
    },
    {
      title: "Estado",
      dataIndex: "estado_mikrotik",
      key: "estado_mikrotik",
      render: (estado) => (
        <Tag
          color={
            estado === "Activo"
              ? "green"
              : estado === "No Existe"
                ? "red"
                : "orange"
          }
        >
          {estado}
        </Tag>
      ),
    },
    {
      title: "Acciones",
      key: "acciones",
      render: (_, record) => (
        <Space>
          {record.estado_mikrotik === "No Existe" && (
            <Button
              icon={<ToolOutlined />}
              onClick={() => handleRepair(record.id_plan)}
            >
              Reparar
            </Button>
          )}
          <Button
            icon={<EditOutlined />}
            onClick={() => {
              setEditingPlan(record);
              form.setFieldsValue(record);
              setIsEditModalOpen(true);
            }}
          />
          <Button
            icon={<DeleteOutlined />}
            danger
            onClick={() => handleDelete(record.id_plan)}
          />
        </Space>
      ),
    },
  ];

  return (
    <div
      style={{
        background: "#fff",
        padding: "16px",
        borderRadius: "8px",
        boxShadow: "0px 4px 12px rgba(0, 0, 0, 0.1)",
      }}
    >
      <Row justify="space-between" align="middle" style={{ marginBottom: "24px" }}>
        <Col>
          <Typography.Title level={4} style={{ margin: 0, fontWeight: "bold", color: "#ff4d4f" }}>
            Planes ({filteredPlanes.length})
          </Typography.Title>
        </Col>
        <Col>
          <Space>
            <Button icon={<SyncOutlined />} onClick={fetchPlanes} loading={loading} style={{ borderColor: "#ff4d4f", color: "#ff4d4f", fontWeight: "bold" }}>
              Actualizar
            </Button>
            <Button type="primary" icon={<PlusOutlined />} onClick={() => {
              setEditingPlan(null);
              form.resetFields();
              setIsCreateModalOpen(true);
            }} style={{ backgroundColor: "#ff4d4f", borderColor: "#ff4d4f", fontWeight: "bold" }}>
              Crear Plan
            </Button>
          </Space>
        </Col>
      </Row>

      <Input
        placeholder="Buscar planes..."
        prefix={<SearchOutlined />}
        value={search}
        onChange={handleSearch}
        style={{
          marginBottom: "16px",
          width: "100%",
          borderRadius: "8px",
          padding: "8px 16px",
        }}
      />

      <div style={{ overflowX: "auto" }}>
        <Table
          dataSource={filteredPlanes}
          columns={columns}
          rowKey="id_plan"
          loading={loading}
          pagination={{ pageSize: 10 }}
          bordered
          style={{
            background: "#fff",
            borderRadius: "8px",
          }}
        />
      </div>

      {/* Modal para Crear Plan */}
      <Modal
        title="Crear Plan"
        open={isCreateModalOpen}
        onCancel={() => {
          setIsCreateModalOpen(false);
          form.resetFields();
        }}
        onOk={() => form.submit()}
      >
        <Form form={form} layout="vertical" onFinish={handleCreateOrUpdate}>
          <Form.Item
            name="id_router"
            label="Router"
            rules={[{ required: true, message: "Seleccione un router." }]}
          >
            <Select placeholder="Seleccione un router">
              {routers.map((router) => (
                <Option key={router.id_router} value={router.id_router}>
                  {router.nombre_router}
                </Option>
              ))}
            </Select>
          </Form.Item>
          <Form.Item
            name="id_ippool"
            label="IP Pool"
            rules={[{ required: true, message: "Seleccione un IP Pool." }]}
          >
            <Select placeholder="Seleccione un IP Pool">
              {ippools.map((ippool) => (
                <Option key={ippool.id_ippool} value={ippool.id_ippool}>
                  {ippool.nombre_pool}
                </Option>
              ))}
            </Select>
          </Form.Item>
          <Form.Item
            name="nombre_plan"
            label="Nombre del Plan"
            rules={[{ required: true, message: "El nombre es obligatorio." }]}
          >
            <Input />
          </Form.Item>
          <Form.Item name="descripcion_plan" label="Descripción">
            <Input.TextArea />
          </Form.Item>
          <Form.Item
            name="precio"
            label="Precio"
            rules={[{ required: true, message: "Ingrese el precio." }]}
          >
            <InputNumber min={0} style={{ width: "100%" }} />
          </Form.Item>
          <Form.Item
            name="mb_subida"
            label="Velocidad de Subida (Mbps)"
            rules={[{ required: true, message: "Ingrese la velocidad de subida." }]}
          >
            <InputNumber min={1} style={{ width: "100%" }} />
          </Form.Item>
          <Form.Item
            name="mb_bajada"
            label="Velocidad de Bajada (Mbps)"
            rules={[{ required: true, message: "Ingrese la velocidad de bajada." }]}
          >
            <InputNumber min={1} style={{ width: "100%" }} />
          </Form.Item>
        </Form>
      </Modal>

      {/* Modal para Editar Plan */}
      <Modal
        title="Editar Plan"
        open={isEditModalOpen}
        onCancel={() => {
          setIsEditModalOpen(false);
          form.resetFields();
        }}
        onOk={() => form.submit()}
      >
        <Form form={form} layout="vertical" onFinish={handleCreateOrUpdate}>
          <Form.Item
            name="id_router"
            label="Router"
            rules={[{ required: true, message: "Seleccione un router." }]}
          >
            <Select placeholder="Seleccione un router">
              {routers.map((router) => (
                <Option key={router.id_router} value={router.id_router}>
                  {router.nombre_router}
                </Option>
              ))}
            </Select>
          </Form.Item>
          <Form.Item
            name="id_ippool"
            label="IP Pool"
            rules={[{ required: true, message: "Seleccione un IP Pool." }]}
          >
            <Select placeholder="Seleccione un IP Pool">
              {ippools.map((ippool) => (
                <Option key={ippool.id_ippool} value={ippool.id_ippool}>
                  {ippool.nombre_pool}
                </Option>
              ))}
            </Select>
          </Form.Item>
          <Form.Item
            name="nombre_plan"
            label="Nombre del Plan"
            rules={[{ required: true, message: "El nombre es obligatorio." }]}
          >
            <Input />
          </Form.Item>
          <Form.Item name="descripcion_plan" label="Descripción">
            <Input.TextArea />
          </Form.Item>
          <Form.Item
            name="precio"
            label="Precio"
            rules={[{ required: true, message: "Ingrese el precio." }]}
          >
            <InputNumber min={0} style={{ width: "100%" }} />
          </Form.Item>
          <Form.Item
            name="mb_subida"
            label="Velocidad de Subida (Mbps)"
            rules={[{ required: true, message: "Ingrese la velocidad de subida." }]}
          >
            <InputNumber min={1} style={{ width: "100%" }} />
          </Form.Item>
          <Form.Item
            name="mb_bajada"
            label="Velocidad de Bajada (Mbps)"
            rules={[{ required: true, message: "Ingrese la velocidad de bajada." }]}
          >
            <InputNumber min={1} style={{ width: "100%" }} />
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
}
