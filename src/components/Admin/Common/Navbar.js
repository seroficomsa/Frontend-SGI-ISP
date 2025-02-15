import React, { useEffect, useState } from "react";
import { Layout, Row, Col, Space, Button, Avatar, Typography, Dropdown, Menu, Spin, Divider } from "antd";
import * as Icons from "@ant-design/icons";
import useAuth from "../../../hooks/useAuth";

const { Header } = Layout;

function Icon({ name, style }) {
  const IconComponent = Icons[name];
  return IconComponent ? <IconComponent style={style} /> : null;
}

export default function Navbar({ setCollapsed, collapsed }) {
  const { user, logout, isLoading } = useAuth();
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const handleResize = () => setIsMobile(window.innerWidth <= 768);
    handleResize();
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  const handleLogout = () => {
    logout();
  };

  const dropdownMenu = (
    <Menu
      style={{
        borderRadius: "12px",
        boxShadow: "0 4px 12px rgba(0, 0, 0, 0.1)",
        padding: "8px",
      }}
    >
      <Menu.Item
        key="1"
        icon={<Icon name="UserOutlined" style={{ fontSize: "16px", marginRight: "8px" }} />}
        style={{
          fontSize: "14px",
          padding: "10px 16px",
        }}
      >
        Mi Perfil
      </Menu.Item>
      <Menu.Item
        key="2"
        icon={<Icon name="SettingOutlined" style={{ fontSize: "16px", marginRight: "8px" }} />}
        style={{
          fontSize: "14px",
          padding: "10px 16px",
        }}
      >
        Configuración
      </Menu.Item>
      <Divider style={{ margin: "8px 0" }} />
      <Menu.Item
        key="3"
        icon={<Icon name="LogoutOutlined" style={{ fontSize: "16px", marginRight: "8px", color: "red" }} />}
        onClick={handleLogout}
        style={{
          fontSize: "14px",
          padding: "10px 16px",
          color: "red",
        }}
      >
        Cerrar Sesión
      </Menu.Item>
    </Menu>
  );

  if (isLoading) {
    return (
      <Header
        style={{
          background: "#f0f2f5",
          padding: "16px",
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          boxShadow: "0 2px 8px rgba(0, 0, 0, 0.1)",
        }}
      >
        <Spin tip="Cargando usuario..." size="large" />
      </Header>
    );
  }

  return (
    <Header
      style={{
        background: "#ffffff",
        padding: "0 24px",
        boxShadow: "0 2px 8px rgba(0, 0, 0, 0.1)",
        position: "sticky",
        top: 0,
        zIndex: 1000,
      }}
    >
      <Row align="middle" justify="space-between">
        {/* Menú lateral */}
        <Col>
          <Button
            type="text"
            icon={<Icon name="MenuOutlined" style={{ fontSize: "20px", color: "#595959" }} />}
            onClick={() => setCollapsed(!collapsed)}
          />
        </Col>

        {/* Usuario */}
        <Col>
          {user?.user?.nombres ? (
            <Dropdown overlay={dropdownMenu} trigger={["click"]}>
              <Space align="center">
                <Avatar
                  size={40}
                  style={{
                    backgroundColor: "#f5222d",
                    fontSize: "18px",
                    color: "#ffffff",
                  }}
                >
                  {user.user.nombres[0]}
                  {user.user.apellidos[0]}
                </Avatar>
                {!isMobile && (
                  <div style={{ lineHeight: "1.2" }}>
                    <Typography.Text
                      strong
                      style={{
                        fontSize: "14px",
                        color: "#333333",
                      }}
                    >
                      {user.user.nombres} {user.user.apellidos}
                    </Typography.Text>
                    <br />
                    <Typography.Text
                      style={{
                        fontSize: "12px",
                        color: "#8c8c8c",
                      }}
                    >
                      {user.user.rol}
                    </Typography.Text>
                  </div>
                )}
                <Icon name="DownOutlined" style={{ fontSize: "16px", color: "#595959" }} />
              </Space>
            </Dropdown>
          ) : (
            <Typography.Text style={{ color: "#595959" }}>Usuario no encontrado</Typography.Text>
          )}
        </Col>
      </Row>
    </Header>
  );
}
