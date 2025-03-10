import React, { useEffect } from "react";
import { Layout, Menu, Drawer } from "antd";
import { useNavigate, useLocation } from "react-router-dom";
import * as Icons from "@ant-design/icons";
import LogoIcon from "../../../assets/img/logos/icon-logo.png";
import './Sidebar.css';

const { Sider } = Layout;

// Componente para renderizar íconos dinámicamente
function Icon({ icon, ...props }) {
  const AntIcon = Icons[icon];
  if (!AntIcon) {
    console.error(`Ícono "${icon}" no encontrado en @ant-design/icons`);
    return null;
  }
  return React.createElement(AntIcon, { ...props });
}

export default function Sidebar({ collapsed, setCollapsed, isMobile }) {
  const navigate = useNavigate();
  const location = useLocation(); // Para obtener la URL actual y marcar el ítem activo

  useEffect(() => {
    setCollapsed(isMobile);
  }, [isMobile, setCollapsed]);

  // Rutas del Sidebar
  const menuItems = [
    { key: "/admin", label: "Inicio", icon: "DashboardOutlined", path: "/admin" },
    {
      key: "clientes",
      label: "Clientes",
      icon: "TeamOutlined",
      children: [
        { key: "/admin/clientes", label: "Listar Clientes", icon: "UnorderedListOutlined", path: "/admin/clientes" },
        { key: "/admin/clientes/crear", label: "Crear Cliente", icon: "UserAddOutlined", path: "/admin/clientes/crear" },
      ],
    },
    {
      key: "sistema",
      label: "Sistema",
      icon: "SettingOutlined",
      children: [
        { key: "/admin/routers", label: "Routers", icon: "CloudServerOutlined", path: "/admin/routers" },
        { key: "/admin/olts", label: "OLTs", icon: "ClusterOutlined", path: "/admin/olts" },
        { key: "/admin/ips", label: "IPs", icon: "GlobalOutlined", path: "/admin/ips" },
        { key: "/admin/planes", label: "Planes", icon: "BarsOutlined", path: "/admin/planes" },
      ],
    },
    {
      key: "inventarios",
      label: "Inventarios",
      icon: "AppstoreOutlined",
      children: [
        { key: "/admin/inventarios/onts", label: "ONTs", icon: "DatabaseOutlined", path: "/admin/inventarios/onts" },
      ],
    },
    {
      key: "monitoreo",
      label: "Monitoreo",
      icon: "EyeOutlined", // También puedes probar "MonitorOutlined" o "EyeOutlined"
      path: "/admin/monitoreo",
    },
  ];

  const handleMenuClick = ({ key }) => {
    const selectedItem = findMenuItemByKey(menuItems, key);
    if (selectedItem && selectedItem.path) {
      navigate(selectedItem.path);
      if (isMobile) setCollapsed(true);
    }
  };

  // Función recursiva para encontrar un ítem del menú por su clave
  const findMenuItemByKey = (items, key) => {
    for (const item of items) {
      if (item.key === key) return item;
      if (item.children) {
        const found = findMenuItemByKey(item.children, key);
        if (found) return found;
      }
    }
    return null;
  };

  // Convertir los ítems del menú a la estructura de Ant Design
  const getMenuItems = (items) => {
    return items.map((item) => {
      if (item.children) {
        return {
          key: item.key,
          icon: <Icon icon={item.icon} />,
          label: item.label,
          children: getMenuItems(item.children),
        };
      }
      return {
        key: item.key,
        icon: <Icon icon={item.icon} />,
        label: item.label,
      };
    });
  };

  return isMobile ? (
    <Drawer
      open={!collapsed}
      placement="left"
      onClose={() => setCollapsed(true)}
      bodyStyle={{ padding: 0 }}
    >
      <Menu
        mode="inline"
        onClick={handleMenuClick}
        selectedKeys={[location.pathname]}
        defaultSelectedKeys={["/admin/planes"]}
        items={getMenuItems(menuItems)}
        className="custom-sidebar-menu"
      />
    </Drawer>
  ) : (
    <Sider
      collapsed={collapsed}
      onCollapse={(value) => setCollapsed(value)}
      style={{
        background: "#ffffff",
        height: "100vh",
        position: "sticky",
        top: 0,
        overflow: "hidden",
        boxShadow: "none",
      }}
    >
      <div
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          height: "80px",
          borderBottom: "1px solid #f0f0f0",
        }}
      >
        <img
          src={LogoIcon}
          alt="Company Logo"
          style={{
            maxHeight: 50,
            maxWidth: "80%",
            transition: "all 0.3s ease",
          }}
        />
      </div>
      <Menu
        mode="inline"
        onClick={handleMenuClick}
        selectedKeys={[location.pathname]}
        defaultSelectedKeys={["/admin/planes"]}
        items={getMenuItems(menuItems)}
        className="custom-sidebar-menu"
      />
    </Sider>
  );
}
