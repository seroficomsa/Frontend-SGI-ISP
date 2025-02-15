import React, { useState, useEffect } from "react";
import {
  Typography,
  Button,
  Table,
  Space,
  Input,
  Row,
  Col,
  Tag,
  Modal,
  Form,
  InputNumber,
  message,
  Tooltip
} from "antd";
import {
  PlusOutlined,
  EditOutlined,
  DeleteOutlined,
  SyncOutlined,
  SearchOutlined
} from "@ant-design/icons";
import useAuth from "../../../hooks/useAuth";
import {
  obtenerRouters,
  crearRouter,
  actualizarRouter,
  eliminarRouter,
  // Este método deberías implementarlo en tu API, similar a "VerificarConexionRouter"
  verificarConexionRouter 
} from "../../../api/routers";

export default function AdminRoutersPage() {
  const [routers, setRouters] = useState([]);
  const [filteredRouters, setFilteredRouters] = useState([]);
  const [totalRouters, setTotalRouters] = useState(0);
  const [loading, setLoading] = useState(false);
  const [search, setSearch] = useState("");

  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);

  const [editingRouter, setEditingRouter] = useState(null);
  const [routerToDelete, setRouterToDelete] = useState(null);
  const [errorMessages, setErrorMessages] = useState([]);

  const [form] = Form.useForm();
  const { user } = useAuth();

  // Cargar la lista de routers
  const fetchRouters = async () => {
    setLoading(true);
    try {
      const token = user?.access_token;
      const response = await obtenerRouters(token);
      if (response?.data) {
        setRouters(response.data);
        setFilteredRouters(response.data);
        setTotalRouters(response.total || response.data.length || 0);
      } else {
        throw new Error("No se pudo obtener la información de routers.");
      }
    } catch (error) {
      console.error("Error al obtener los routers:", error);
      message.error("Error al obtener routers.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchRouters();
    // eslint-disable-next-line
  }, []);

  // Filtrado local
  const handleSearch = (e) => {
    const value = e.target.value.toLowerCase();
    setSearch(value);
    const filtered = routers.filter(
      (router) =>
        router.nombre_router.toLowerCase().includes(value) ||
        router.descripcion_router.toLowerCase().includes(value) ||
        router.ip.toLowerCase().includes(value) ||
        router.modelo?.toLowerCase().includes(value)
    );
    setFilteredRouters(filtered);
  };

  // Crear o actualizar router
  const handleCreateOrUpdate = async (values) => {
    try {
      const token = user?.access_token;
      if (editingRouter) {
        // Editar
        await actualizarRouter(editingRouter.id_router, values, token);
        message.success("Router actualizado exitosamente.");
      } else {
        // Crear
        await crearRouter(values, token);
        message.success("Router creado exitosamente.");
      }
      setIsCreateModalOpen(false);
      setIsEditModalOpen(false);
      form.resetFields();
      fetchRouters();
    } catch (error) {
      console.error("Error al guardar el router:", error);

      let errorMessage =
        "Error al lograr la conexión con el router, verifica los datos proporcionados!";

      if (error.response?.data?.message) {
        errorMessage = error.response.data.message;
      }

      // Ajuste si es un error de conexión
      if (
        errorMessage.includes("No se pudo conectar al router") ||
        errorMessage.includes("credenciales")
      ) {
        errorMessage =
          "Error al lograr la conexión con el router, verifica los datos proporcionados / credenciales!";
      }

      message.error(errorMessage);
    }
  };

  // Pedir confirmación para eliminar
  const handleDelete = (idRouter) => {
    setRouterToDelete(idRouter);
    setIsDeleteModalOpen(true);
  };

  // Confirmar eliminación
  const handleConfirmDelete = async () => {
    try {
      const token = user?.access_token;
      setErrorMessages([]);

      const response = await eliminarRouter(routerToDelete, token);
      if (response.success) {
        message.success("Router eliminado exitosamente.");
        fetchRouters();
      }
    } catch (error) {
      if (error.response?.data?.message) {
        setErrorMessages([error.response.data.message]);
      } else {
        setErrorMessages(["No se pudo eliminar el router."]);
      }
      message.error("No se pudo eliminar el router.");
    } finally {
      setIsDeleteModalOpen(false);
      setRouterToDelete(null);
    }
  };
  // -- REPARACIÓN MASIVA: Reintentar "conexión" a cada router desconectado o desconocido
  const handleRepairAll = async () => {
    setLoading(true);
    try {
      const token = user?.access_token;

      // Filtramos los routers que están desconectados o desconocidos
      const desconectados = routers.filter((r) =>
        ["Desconectado", "Desconocido"].includes(r.estado_router)
      );

      for (const router of desconectados) {
        try {
          const payload = {
            ip: router.ip,
            port: router.port,
            user: router.user,
            password: router.password
          };
          // Llamamos a la función de verificar/conectar
          const resp = await verificarConexionRouter(payload, token);
          if (resp.success) {
            message.success(
              `Se reconectó correctamente el router ${router.nombre_router}`
            );
          } else {
            message.error(
              `No se pudo reconectar el router ${router.nombre_router}: ${resp.message}`
            );
          }
        } catch (err) {
          message.error(
            `Error en router ${router.nombre_router} => ${err.message}`
          );
        }
      }

      // Al terminar, recargamos la lista
      fetchRouters();
    } catch (error) {
      console.error("Error en la reparación masiva:", error);
      message.error("Error al intentar la reparación masiva.");
    } finally {
      setLoading(false);
    }
  };

  // Definición de columnas
  const columns = [
    {
      title: "N°",
      key: "index",
      render: (_, __, index) => (
        <Typography.Text strong>{index + 1}</Typography.Text>
      ),
      width: 50,
      align: "center"
    },
    {
      title: "Nombre del Router",
      dataIndex: "nombre_router",
      key: "nombre_router",
      render: (text) => <Typography.Text ellipsis>{text}</Typography.Text>
    },
    {
      title: "Descripción",
      dataIndex: "descripcion_router",
      key: "descripcion_router",
      render: (text) => <Typography.Text ellipsis>{text}</Typography.Text>
    },
    {
      title: "IP",
      dataIndex: "ip",
      key: "ip",
      render: (text) => <Typography.Text ellipsis>{text}</Typography.Text>
    },
    {
      title: "Puerto",
      dataIndex: "port",
      key: "port"
    },
    {
      title: "Información",
      key: "modelo",
      render: (_, record) => (
        <div>
          {record.modelo || "Sin información"} -{" "}
          {record.board_name || "Sin información"}
        </div>
      )
    },
    {
      title: "Estado",
      dataIndex: "estado_router",
      key: "estado_router",
      render: (estado) => {
        let color = "orange";
        if (estado === "Activo") color = "green";
        if (estado === "Desconectado") color = "red";
        return <Tag color={color}>{estado}</Tag>;
      }
    },
    {
      title: "Acciones",
      key: "acciones",
      render: (_, record) => {
        // Si tiene relaciones, deshabilitar el botón Eliminar
        const disableDelete = record.tiene_relaciones === true;

        return (
          <Space>
            <Button
              icon={<EditOutlined />}
              onClick={() => {
                setEditingRouter(record);
                form.setFieldsValue(record);
                setIsEditModalOpen(true);
              }}
            />
            <Tooltip
              title={
                disableDelete
                  ? "No se puede eliminar. El router tiene relaciones asociadas."
                  : "Eliminar"
              }
            >
              <Button
                icon={<DeleteOutlined />}
                danger
                onClick={() => handleDelete(record.id_router)}
                disabled={disableDelete}
              />
            </Tooltip>
          </Space>
        );
      }
    }
  ];

  // Routers en estado "Desconectado" o "Desconocido"
  const routersCaidos = routers.filter((r) =>
    ["Desconectado", "Desconocido"].includes(r.estado_router)
  );

  return (
    <div
      style={{
        background: "#fff",
        padding: "16px",
        borderRadius: "8px",
        boxShadow: "0px 4px 12px rgba(0, 0, 0, 0.1)"
      }}
    >
      <Row justify="space-between" align="middle" style={{ marginBottom: "24px" }}>
        <Col>
          <Typography.Title
            level={4}
            style={{ margin: 0, fontWeight: "bold", color: "#ff4d4f" }}
          >
            Routers ({totalRouters})
          </Typography.Title>
        </Col>
        <Col>
          <Space>
            {/* Botón "Actualizar" estilo outline rojo */}
            <Button
              icon={<SyncOutlined />}
              onClick={fetchRouters}
              loading={loading}
              style={{
                borderRadius: "8px",
                borderColor: "#ff4d4f",
                color: "#ff4d4f",
                fontWeight: "bold",
                backgroundColor: "transparent"
              }}
            >
              Actualizar
            </Button>

            {/* Aparece si hay routers caídos para hacer "Reparación" o "Reconexión" masiva */}
            {routersCaidos.length > 0 && (
              <Button
                icon={<SyncOutlined />}
                onClick={handleRepairAll}
                loading={loading}
                style={{
                  borderRadius: "8px",
                  borderColor: "#ff4d4f",
                  color: "#ff4d4f",
                  fontWeight: "bold",
                  backgroundColor: "transparent"
                }}
              >
                Reparar Todo
              </Button>
            )}

            {/* Botón "Crear Router" en rojo */}
            <Button
              type="primary"
              icon={<PlusOutlined />}
              onClick={() => {
                setEditingRouter(null);
                form.resetFields();
                setIsCreateModalOpen(true);
              }}
              style={{
                backgroundColor: "#ff4d4f",
                borderColor: "#ff4d4f",
                fontWeight: "bold"
              }}
            >
              Crear Router
            </Button>
          </Space>
        </Col>
      </Row>

      <Input
        placeholder="Buscar routers por nombre, descripción, IP o modelo..."
        prefix={<SearchOutlined />}
        value={search}
        onChange={handleSearch}
        style={{
          marginBottom: "16px",
          width: "100%",
          borderRadius: "8px",
          padding: "8px 16px"
        }}
      />

      <div style={{ overflowX: "auto" }}>
        <Table
          dataSource={filteredRouters}
          columns={columns}
          rowKey="id_router"
          loading={loading}
          pagination={{ pageSize: 10 }}
          bordered
          style={{
            background: "#fff",
            borderRadius: "8px"
          }}
        />
      </div>

      {/* Modal CREAR */}
      <Modal
        title="Crear Router"
        open={isCreateModalOpen}
        onCancel={() => {
          setIsCreateModalOpen(false);
          form.resetFields();
        }}
        onOk={() => form.submit()}
        okButtonProps={{
          style: {
            backgroundColor: "rgb(255, 77, 79)",
            borderColor: "rgb(255, 77, 79)"
          }
        }}
      >
        <Form form={form} layout="vertical" onFinish={handleCreateOrUpdate}>
          <Form.Item
            name="nombre_router"
            label="Nombre del Router"
            rules={[{ required: true, message: "El nombre es obligatorio." }]}
          >
            <Input />
          </Form.Item>
          <Form.Item name="descripcion_router" label="Descripción">
            <Input.TextArea />
          </Form.Item>
          <Form.Item
            name="ip"
            label="IP"
            rules={[{ required: true, message: "La IP es obligatoria." }]}
          >
            <Input />
          </Form.Item>
          <Form.Item
            name="port"
            label="Puerto"
            rules={[{ required: true, message: "El puerto es obligatorio." }]}
          >
            <InputNumber min={1} style={{ width: "100%" }} />
          </Form.Item>
          <Form.Item
            name="user"
            label="Usuario"
            rules={[{ required: true, message: "El usuario es obligatorio." }]}
          >
            <Input />
          </Form.Item>
          <Form.Item
            name="password"
            label="Contraseña"
            rules={[{ required: true, message: "La contraseña es obligatoria." }]}
          >
            <Input.Password />
          </Form.Item>
        </Form>
      </Modal>

      {/* Modal EDITAR */}
      <Modal
        title="Editar Router"
        open={isEditModalOpen}
        onCancel={() => {
          setIsEditModalOpen(false);
          form.resetFields();
        }}
        onOk={() => form.submit()}
        okButtonProps={{
          style: {
            backgroundColor: "rgb(255, 77, 79)",
            borderColor: "rgb(255, 77, 79)"
          }
        }}
      >
        <Form form={form} layout="vertical" onFinish={handleCreateOrUpdate}>
          <Form.Item
            name="nombre_router"
            label="Nombre del Router"
            rules={[{ required: true, message: "El nombre es obligatorio." }]}
          >
            <Input />
          </Form.Item>
          <Form.Item name="descripcion_router" label="Descripción">
            <Input.TextArea />
          </Form.Item>
          <Form.Item
            name="ip"
            label="IP"
            rules={[{ required: true, message: "La IP es obligatoria." }]}
          >
            <Input />
          </Form.Item>
          <Form.Item
            name="port"
            label="Puerto"
            rules={[{ required: true, message: "El puerto es obligatorio." }]}
          >
            <InputNumber min={1} style={{ width: "100%" }} />
          </Form.Item>
          <Form.Item
            name="user"
            label="Usuario"
            rules={[{ required: true, message: "El usuario es obligatorio." }]}
          >
            <Input />
          </Form.Item>
          <Form.Item
            name="password"
            label="Contraseña"
            rules={[{ required: true, message: "La contraseña es obligatoria." }]}
          >
            <Input.Password />
          </Form.Item>
        </Form>
      </Modal>

      {/* Modal ELIMINAR */}
      <Modal
        title="¿Estás seguro?"
        open={isDeleteModalOpen}
        onOk={handleConfirmDelete}
        onCancel={() => setIsDeleteModalOpen(false)}
        okText="Sí, eliminar"
        cancelText="Cancelar"
        okButtonProps={{
          style: {
            backgroundColor: "rgb(255, 77, 79)",
            borderColor: "rgb(255, 77, 79)"
          }
        }}
      >
        <Typography.Text>
          ¿Estás seguro de que deseas eliminar este router? Esta acción no se
          puede deshacer.
        </Typography.Text>
      </Modal>
    </div>
  );
}
