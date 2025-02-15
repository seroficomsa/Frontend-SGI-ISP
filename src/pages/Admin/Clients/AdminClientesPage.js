import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import {
  Typography,
  Button,
  Table,
  Space,
  Input,
  Row,
  Col,
  Tag,
  message,
  Modal,
  Alert,
} from "antd";
import {
  PlusOutlined,
  EditOutlined,
  DeleteOutlined,
  SyncOutlined,
  SearchOutlined,
  ExclamationCircleOutlined,
  ToolOutlined,
  EyeOutlined,
} from "@ant-design/icons";
import useAuth from "../../../hooks/useAuth";
import {
  obtenerClientes,
  eliminarCliente,
  repararCliente,
} from "../../../api/clients";

const { confirm } = Modal;

export default function AdminClientesPage() {
  const [clientes, setClientes] = useState([]);
  const [filteredClientes, setFilteredClientes] = useState([]);
  const [missingMikrotik, setMissingMikrotik] = useState([]); // <--- Estado para los que no existen en Mikrotik
  const [loading, setLoading] = useState(false);
  const [search, setSearch] = useState("");
  const navigate = useNavigate();
  const { user } = useAuth();

  // Obtener la lista de clientes
  const fetchClientes = async () => {
    setLoading(true);
    try {
      const token = user?.access_token;
      const response = await obtenerClientes(token);
      if (response?.data) {
        setClientes(response.data);
        setFilteredClientes(response.data);

        // Filtrar los que están en estado A pero existe_mikrotik = false
        const missing = response.data.filter(
          (c) => c.estado === "A" && c.existe_mikrotik === false
        );
        setMissingMikrotik(missing);

      } else {
        throw new Error("No se pudo obtener la información de clientes.");
      }
    } catch (error) {
      console.error("Error al obtener los clientes:", error);
      message.error("Error al cargar los clientes.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchClientes();
    // eslint-disable-next-line
  }, []);

  // Maneja la lógica de "Reparar"
  const handleReparar = async (idCliente) => {
    try {
      setLoading(true);
      const token = user?.access_token;
      const response = await repararCliente(idCliente, token);
      if (response.success) {
        message.success(response.message || "Cliente reparado en MikroTik.");
        // recargar la lista si deseas
        fetchClientes();
      } else {
        message.error(response.message || "Error al reparar el cliente.");
      }
    } catch (error) {
      console.error(error);
      message.error(error.message);
    } finally {
      setLoading(false);
    }
  };

  // Búsqueda en la tabla
  const handleSearch = (e) => {
    const value = e.target.value.toLowerCase();
    setSearch(value);
    const filtered = clientes.filter(
      (c) =>
        c.nombres.toLowerCase().includes(value) ||
        c.apellidos.toLowerCase().includes(value) ||
        c.login.toLowerCase().includes(value) ||
        c.identificacion.toLowerCase().includes(value) ||
        c.correo_electronico.toLowerCase().includes(value)
    );
    setFilteredClientes(filtered);
  };

  // Confirmar antes de eliminar
  const handleDelete = (idCliente) => {
    confirm({
      title: "¿Está seguro de realizar esta operación?",
      icon: <ExclamationCircleOutlined style={{ color: "#ff4d4f" }} />,
      content: "Esta acción no se podrá deshacer. ¿Desea continuar?",
      okText: "Sí, eliminar",
      okType: "danger",
      cancelText: "No",
      onOk: () => doDelete(idCliente),
    });
  };

  // Lógica de eliminación
  const doDelete = async (idCliente) => {
    try {
      setLoading(true);
      const token = user?.access_token;
      const payload = { id_usuario_auditor: user?.id_usuario };

      const response = await eliminarCliente(idCliente, payload, token);
      if (response.success) {
        message.success("Cliente eliminado correctamente.");
        fetchClientes(); // recargar la tabla
      } else {
        message.error(response.message || "Error al eliminar.");
      }
    } catch (error) {
      console.error(error);
      message.error("Error al eliminar el cliente.");
    } finally {
      setLoading(false);
    }
  };

  const columns = [
    {
      title: "N°",
      key: "index",
      render: (_, __, index) => <Typography.Text strong>{index + 1}</Typography.Text>,
      width: 50,
      align: "center",
    },
    {
      title: "Nombres",
      dataIndex: "nombres",
      key: "nombres",
    },
    {
      title: "Apellidos",
      dataIndex: "apellidos",
      key: "apellidos",
    },
    {
      title: "Login",
      dataIndex: "login",
      key: "login",
    },
    {
      title: "Identificación",
      dataIndex: "identificacion",
      key: "identificacion",
    },
    {
      title: "Correo Electrónico",
      dataIndex: "correo_electronico",
      key: "correo_electronico",
    },
    {
      title: "Estado",
      dataIndex: "estado",
      key: "estado",
      render: (estado) => {
        let color = "green";
        let label = "Activo";
        if (estado === "I") {
          color = "volcano";
          label = "Inactivo";
        } else if (estado === "E") {
          color = "red";
          label = "Eliminado";
        }
        return <Tag color={color}>{label}</Tag>;
      },
    },
    {
      title: "Acciones",
      key: "acciones",
      fixed: "right", // 🔥 Mantiene las acciones visibles siempre
      render: (_, record) => (
        <Space size="small">
          {/* 👀 Icono de Ver sin texto */}
          <Button
            type="text"
            icon={<EyeOutlined />}
            onClick={() => navigate(`/admin/clientes/${record.id_cliente}`)}
            style={{ color: "#ff4d4f" }}
          />

          {/* ✏️ Icono de Editar */}
          <Button
            type="text"
            icon={<EditOutlined />}
            onClick={() => navigate(`/admin/clientes/editar/${record.id_cliente}`)}
            style={{ color: "#ff4d4f" }}
          />

          {/* 🗑️ Icono de Eliminar */}
          <Button
            type="text"
            icon={<DeleteOutlined />}
            danger
            onClick={() => handleDelete(record.id_cliente)}
          />
        </Space>
      ),
      width: 100,
      align: "center",
    },
  ];
  // Armamos la lista de nombres a reparar
  const usuariosAReparar = missingMikrotik.map((c) => `${c.nombres} ${c.apellidos}`);

  return (
    <div
      style={{
        background: "#fff",
        padding: "16px",
        borderRadius: "8px",
        boxShadow: "0px 4px 12px rgba(0, 0, 0, 0.1)",
      }}
    >
      {/* ALERTA solo si hay al menos 1 usuario a reparar */}
      {missingMikrotik.length > 0 && (
        <div style={{ marginBottom: 16 }}>
          <Alert
            message="Los siguientes usuarios no se encuentran en el servidor. Es necesario repararlos."
            description={
              <ul>
                {usuariosAReparar.map((name, idx) => (
                  <li key={idx}>{name}</li>
                ))}
              </ul>
            }
            type="warning"
            showIcon
          />
        </div>
      )}

      <Row
        justify="space-between"
        align="middle"
        className="row-header"
        style={{ marginBottom: "24px" }}
      >
        <Col>
          <Typography.Title
            level={4}
            style={{ margin: 0, fontWeight: "bold", color: "#ff4d4f" }}
          >
            Clientes ({filteredClientes.length})
          </Typography.Title>
        </Col>
        <Col>
          <Space>
            <Button
              icon={<SyncOutlined />}
              onClick={fetchClientes}
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
            <Button
              type="primary"
              icon={<PlusOutlined />}
              onClick={() => navigate("/admin/clientes/crear")}
              style={{
                backgroundColor: "#ff4d4f",
                borderColor: "#ff4d4f",
                fontWeight: "bold",
              }}
            >
              Crear Cliente
            </Button>
          </Space>
        </Col>
      </Row>

      <Input
        placeholder="Buscar clientes por nombre, apellidos, identificación o correo..."
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
          dataSource={filteredClientes}
          columns={columns}
          rowKey="id_cliente"
          loading={loading}
          pagination={{ pageSize: 10 }}
          bordered
          style={{ background: "#fff", borderRadius: "8px" }}
        />
      </div>

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
