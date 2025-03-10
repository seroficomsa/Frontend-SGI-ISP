import React from "react";
import { Routes, Route, Navigate } from "react-router-dom";
import PrivateRoute from "./PrivateRoute";
import RoleRoute from "./RoleRoute";
import AdminPage from "../pages/Admin/AdminPage";
import AdminClientesPage from "../pages/Admin/Clients/AdminClientesPage";

// import AdminClientesPage from "../pages/Admin/Clients/AdminClientesPage";
import LoginPage from "../pages/General/LoginPage";
import TechnicianPage from "../pages/Tecnico/TecnicoPage";
import VendorPage from "../pages/Vendedor/VendedorPage";
import ClientPage from "../pages/Cliente/ClientePage";
import CrearClientePage from "../pages/Admin/Clients/AdminCreateClientesPage";
import DefaultAdminLayout from "../pages/Admin/DefaultAdminLayout";
import AdminRoutersPage from "../pages/Admin/Routers/AdminRoutersPage";
import CrearRouterPage from "../pages/Admin/Routers/AdminCreateRoutersPage";
import EditarRouterPage from "../pages/Admin/Routers/AdminEditRoutersPage";
import AdminPlanesPage from "../pages/Admin/Plans/AdminPlansPage";
import AdminIPPoolsPage from "../pages/Admin/IPPool/AdminIPPoolPage";
import AdminOLTsPage from "../pages/Admin/Olt/AdminOLTPage";
import AdminOLTInformationPage from "../pages/Admin/Olt/AdminOLTInformationPage";
import AdminOntsPage from "../pages/Admin/Onu/AdminOntsPage";
import AdminClienteInfoPage from "../pages/Admin/Clients/AdminClienteInfoPage";


const AppRoutes = () => (
  <Routes>
    <Route path="/login" element={<LoginPage />} />

    <Route
      path="/admin/*"
      element={
        <PrivateRoute>
          <RoleRoute role="ADMIN">
            <DefaultAdminLayout>
              <Routes>
                <Route path="/" element={<AdminPage />} />
                <Route path="clientes" element={<AdminClientesPage />} />
                <Route path="clientes/crear" element={<CrearClientePage />} />
                <Route path="routers" element={<AdminRoutersPage />} />
                <Route path="routers/crear" element={<CrearRouterPage />} />
                <Route path="clientes/:id_cliente" element={<AdminClienteInfoPage />}   />
                <Route path="routers/editar/:id_router" element={<EditarRouterPage />} />
                <Route path="planes" element={<AdminPlanesPage />} />
                <Route path="ips" element={<AdminIPPoolsPage />} />
                <Route path="olts" element={<AdminOLTsPage />} />
                <Route path="olts/:id_olt" element={<AdminOLTInformationPage />} />
                <Route path="inventarios/onts" element={<AdminOntsPage />} />
                <Route path="*" element={<Navigate to="/admin" />} />
              </Routes>
            </DefaultAdminLayout>
          </RoleRoute>
        </PrivateRoute>
      }
    />


    <Route
      path="/tecnico"
      element={
        <PrivateRoute>
          <RoleRoute role="TECNICO">
            <TechnicianPage />
          </RoleRoute>
        </PrivateRoute>
      }
    />

    <Route
      path="/vendedor"
      element={
        <PrivateRoute>
          <RoleRoute role="VENTAS">
            <VendorPage />
          </RoleRoute>
        </PrivateRoute>
      }
    />

    <Route
      path="/cliente"
      element={
        <PrivateRoute>
          <RoleRoute role="CLIENTE">
            <ClientPage />
          </RoleRoute>
        </PrivateRoute>
      }
    />

    {/* Redirigir cualquier URL no válida al login */}
    <Route path="*" element={<Navigate to="/login" />} />
  </Routes>
);

export default AppRoutes;
