import React from "react";
import { Navigate } from "react-router-dom";
import useAuth from "../hooks/useAuth";

const RoleRoute = ({ children, role }) => {
  const { user } = useAuth();
  return user?.user?.prefix_rol === role ? children : <Navigate to="/login" />;
};

export default RoleRoute;
