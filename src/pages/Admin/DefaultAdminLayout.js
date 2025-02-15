import React from "react";
import { Layout } from "antd";
import Sidebar from "../../components/Admin/Common/Sidebar";
import Navbar from "../../components/Admin/Common/Navbar";

const { Content, Footer } = Layout;

const DefaultAdminLayout = ({ children }) => {
  const [collapsed, setCollapsed] = React.useState(true);
  const isMobile = window.innerWidth <= 768; // Chequeo para dispositivos móviles

  return (
    <Layout>
      <Sidebar collapsed={collapsed} setCollapsed={setCollapsed} isMobile={isMobile} />
      <Layout>
        <Navbar setCollapsed={setCollapsed} collapsed={collapsed} />
        <Content
          style={{
            margin: "16px",
            padding: "16px",
            background: "#fff",
            borderRadius: 8,
            minHeight: "calc(100vh - 64px - 70px)", // Ajuste de altura para contenido
          }}
        >
          {children}
        </Content>
        <Footer style={{ textAlign: "center" }}>
          <p>Seroficom © 2025. Todos los derechos reservados.</p>
        </Footer>
      </Layout>
    </Layout>
  );
};

export default DefaultAdminLayout;
