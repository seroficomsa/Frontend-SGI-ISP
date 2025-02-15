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
  message,
  Tag,
  Alert,
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
  listarIPPools,
  crearIPPool,
  actualizarIPPool,
  eliminarIPPool,
  repararIPPool,
} from "../../../api/ippools";
import { obtenerRouters } from "../../../api/routers";

const { Option } = Select;

export default function AdminIPPoolsPage() {
  const [ippools, setIPPools] = useState([]);
  const [routers, setRouters] = useState([]);
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false); // Modal de confirmación para eliminar
  const [editingIPPool, setEditingIPPool] = useState(null);
  const [deletingIPPool, setDeletingIPPool] = useState(null); // IP Pool a eliminar
  const [form] = Form.useForm();
  const { user } = useAuth();

  // 1. Cargar la lista completa de IP Pools
  const fetchIPPools = async () => {
    setLoading(true);
    try {
      const token = user?.access_token;
      const response = await listarIPPools(token);
      if (response?.success && Array.isArray(response.data)) {
        setIPPools(response.data);
      } else {
        console.error("Error en listarIPPools", response);
        message.error("Error al obtener los IP Pools.");
      }
    } catch (error) {
      console.error("Error al obtener IP Pools:", error);
      message.error("Error al obtener IP Pools.");
    } finally {
      setLoading(false);
    }
  };

  // 2. Cargar routers
  const fetchRouters = async () => {
    try {
      const token = user?.access_token;
      const response = await obtenerRouters(token);
      if (response?.success && Array.isArray(response.data)) {
        setRouters(response.data);
      } else {
        console.error("Error en obtenerRouters", response);
        message.error("No se pudieron cargar los routers.");
      }
    } catch (error) {
      console.error("Error al obtener routers:", error);
      message.error("Error al obtener routers.");
    }
  };

  // 3. Efecto inicial
  useEffect(() => {
    fetchIPPools();
    fetchRouters();
  }, []);

  // 4. Manejo de búsqueda
  const handleSearch = (e) => {
    setSearch(e.target.value.toLowerCase());
  };

  // 5. Crear o actualizar IP Pool
  const handleCreateOrUpdate = async (values) => {
    try {
      const token = user?.access_token;
      if (editingIPPool) {
        await actualizarIPPool(token, editingIPPool.id_ippool, values);
        message.success("IP Pool actualizado exitosamente.");
      } else {
        await crearIPPool(token, values);
        message.success("IP Pool creado exitosamente.");
      }
      setIsModalOpen(false);
      form.resetFields();
      fetchIPPools();
    } catch (error) {
      console.error("Error al guardar el IP Pool:", error);
      message.error(
        error.response?.data?.message || "No se pudo guardar el IP Pool."
      );
    }
  };

  // 6. Eliminar IP Pool
  const handleDelete = async () => {
    if (!deletingIPPool) return;

    try {
      const token = user?.access_token;
      await eliminarIPPool(token, deletingIPPool.id_ippool);
      message.success("IP Pool desactivado exitosamente.");
      setIsDeleteModalOpen(false); // Cerrar el modal de confirmación
      fetchIPPools();
    } catch (error) {
      console.error("Error al eliminar el IP Pool:", error);
      message.error("No se pudo eliminar el IP Pool.");
    }
  };

  // 7. Reparar un solo IP Pool
  const handleRepair = async (id) => {
    try {
      const token = user?.access_token;
      await repararIPPool(token, id);
      message.success("IP Pool reparado exitosamente.");
      fetchIPPools();
    } catch (error) {
      console.error("Error al reparar el IP Pool:", error);
      message.error(error.message || "Error al reparar el IP Pool.");
    }
  };

  // 7.bis Reparación Masiva
  const handleRepairAll = async () => {
    setLoading(true);
    try {
      const token = user?.access_token;
      for (const pool of noExistePools) {
        await repararIPPool(token, pool.id_ippool);
        message.success(`IP Pool '${pool.nombre_pool}' reparado exitosamente.`);
      }
      // Al terminar, recargamos la lista
      fetchIPPools();
    } catch (error) {
      console.error("Error en reparación masiva:", error);
      message.error("No se pudo completar la reparación masiva.");
    } finally {
      setLoading(false);
    }
  };

  // 8. Pools con estado "No Existe"
  const noExistePools = ippools.filter(
    (pool) => pool.estado_mikrotik === "No Existe"
  );

  // 9. Filtrado para la tabla
  const filteredIPPools = ippools.filter(
    (pool) =>
      pool.nombre_pool.toLowerCase().includes(search) ||
      pool.router?.nombre_router?.toLowerCase().includes(search)
  );

  // 10. Columnas de la tabla
  const columns = [
    {
      title: "Nombre del Pool",
      dataIndex: "nombre_pool",
      key: "nombre_pool",
    },
    {
      title: "Subred",
      dataIndex: "subnet",
      key: "subnet",
    },
    {
      title: "Rango de IPs",
      dataIndex: "rango_ip",
      key: "rango_ip",
      render: (rango_ip) => <span>{rango_ip}</span>, // Muestra el rango de IPs
    },
    {
      title: "Estado",
      dataIndex: "estado_mikrotik",
      key: "estado_mikrotik",
      render: (estado) => (
        <Tag color={estado === "Activo" ? "green" : "red"}>{estado}</Tag>
      ),
    },
    {
      title: "Acciones",
      key: "acciones",
      render: (_, record) => (
        <Space>
          <Button
            icon={<EditOutlined />}
            style={{ border: "1px solid #ff4d4f", color: "#ff4d4f" }}
            onClick={() => {
              setEditingIPPool(record); // Establecer el IP Pool a editar
              form.setFieldsValue(record); // Llenar el formulario con los datos del IP Pool
              setIsModalOpen(true); // Abrir el modal de edición
            }}
          />
          <Button
            icon={<DeleteOutlined />}
            danger
            onClick={() => {
              setDeletingIPPool(record); // Establecer el IP Pool a eliminar
              setIsDeleteModalOpen(true); // Abrir el modal de confirmación
            }}
          />
          {record.estado_mikrotik === "No Existe" && (
            <Button
              icon={<ToolOutlined />}
              onClick={() => handleRepair(record.id_ippool)}
              style={{ border: "1px solid #ff4d4f", color: "#ff4d4f" }}
            >
              Reparar
            </Button>
          )}
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
      {/* Alerta si hay Pools "No Existe" */}
      {noExistePools.length > 0 && (
        <Alert
          style={{ marginBottom: "24px" }}
          type="warning"
          showIcon
          closable
          message="Algunos pools no existen en MikroTik."
          description={
            <div>
              {noExistePools.map((pool) => (
                <div key={pool.id_ippool}>
                  <strong>Pool:</strong> {pool.nombre_pool} &nbsp;|&nbsp;
                  <strong>Router:</strong>{" "}
                  {pool.router?.nombre_router ?? "Desconocido"}
                </div>
              ))}
            </div>
          }
        />
      )}

      <Row justify="space-between" align="middle" style={{ marginBottom: "24px" }}>
        <Col>
          <Typography.Title
            level={4}
            style={{ margin: 0, fontWeight: "bold", color: "#ff4d4f" }}
          >
            IP Pools ({filteredIPPools.length})
          </Typography.Title>
        </Col>
        <Col>
          <Space>
            {/* Botón "Actualizar" */}
            <Button
              icon={<SyncOutlined />}
              onClick={fetchIPPools}
              loading={loading}
              style={{
                borderRadius: "8px",
                borderColor: "#ff4d4f",
                color: "#ff4d4f",
                fontWeight: "bold",
              }}
            >
              Actualizar
            </Button>
            {/* Botón "Reparar Todo" (Solo si hay pools "No Existe") */}
            {noExistePools.length > 0 && (
              <Button
                icon={<ToolOutlined />}
                onClick={handleRepairAll}
                style={{ border: "1px solid #ff4d4f", color: "#ff4d4f" }}
              >
                Reparar Todo
              </Button>
            )}
            {/* Botón "Crear IP Pool" */}
            <Button
              type="primary"
              icon={<PlusOutlined />}
              onClick={() => {
                setEditingIPPool(null);
                form.resetFields();
                setIsModalOpen(true);
              }}
              style={{
                backgroundColor: "#ff4d4f",
                borderColor: "#ff4d4f",
                fontWeight: "bold",
              }}
            >
              Crear IP Pool
            </Button>
          </Space>
        </Col>
      </Row>

      {/* Barra de búsqueda */}
      <Input
        placeholder="Buscar IP Pools..."
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

      {/* Tabla principal */}
      <div style={{ overflowX: "auto" }}>
        <Table
          dataSource={filteredIPPools}
          columns={columns}
          rowKey="id_ippool"
          loading={loading}
          pagination={{ pageSize: 10 }}
          bordered
          style={{
            background: "#fff",
            borderRadius: "8px",
          }}
        />
      </div>

      {/* Modal para crear/editar IP Pool */}
      <Modal
        title={editingIPPool ? "Editar IP Pool" : "Crear IP Pool"}
        open={isModalOpen}
        onCancel={() => {
          setIsModalOpen(false);
          form.resetFields();
        }}
        onOk={() => form.submit()}
        okText="Guardar"
        okButtonProps={{ style: { backgroundColor: "#ff4d4f", borderColor: "#ff4d4f" } }}
        destroyOnClose
      >
        <Form form={form} layout="vertical" onFinish={handleCreateOrUpdate}>
          <Form.Item
            name="id_router"
            label="Router"
            rules={[{ required: true, message: "Selecciona un router" }]}
          >
            <Select placeholder="Seleccione un router" allowClear>
              {routers.map((router) => (
                <Option key={router.id_router} value={router.id_router}>
                  {router.nombre_router}
                </Option>
              ))}
            </Select>
          </Form.Item>
          <Form.Item
            name="nombre_pool"
            label="Nombre del Pool"
            rules={[{ required: true, message: "Ingresa un nombre" }]}
          >
            <Input />
          </Form.Item>
          <Form.Item
            name="subnet"
            label="Subred"
            rules={[
              { required: true, message: "Ingresa la subred con el prefijo /x" },
              {
                pattern: /^((25[0-5]|2[0-4]\d|[01]?\d?\d)\.){3}(25[0-5]|2[0-4]\d|[01]?\d?\d)\/(3[0-2]|[12]\d|[1-9]|0)$/,
                message: "Ingresa la subred con el prefijo. Ej: 10.200.0.1/22",
              },
            ]}
          >
            <Input placeholder="10.200.0.1/22" />
          </Form.Item>
        </Form>
      </Modal>

      {/* Modal de confirmación para eliminar */}
      <Modal
  title="¿Estás seguro de eliminar este IP Pool?"
  open={isDeleteModalOpen}
  onOk={handleDelete}
  onCancel={() => setIsDeleteModalOpen(false)}
  okText="Eliminar"
  cancelText="Cancelar"
  okButtonProps={{ style: { backgroundColor: "#ff4d4f", borderColor: "#ff4d4f" } }}
>
  <p>
    Estás a punto de eliminar el IP Pool:{" "}
    <strong>{deletingIPPool?.nombre_pool}</strong>. Esta acción no se puede
    deshacer.
  </p>
</Modal>

    </div>
  );
}