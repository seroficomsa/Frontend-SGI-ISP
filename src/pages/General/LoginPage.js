import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Input, Button, Alert, Spin, Typography } from "antd";
import {
  MailOutlined,
  LockOutlined,
  EyeInvisibleOutlined,
  EyeTwoTone,
  LoginOutlined,
  LoadingOutlined,
} from "@ant-design/icons";
import useAuth from "../../hooks/useAuth";
import { login as apiLogin } from "../../api/auth";

import iconLogo from "../../assets/img/logos/robot.png";


import "./LoginPage.css";

const LoginPage = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false); // Estado para el loading
  const { user, login } = useAuth();
  const navigate = useNavigate();

   useEffect(() => {
      document.title = "Admin - Login | Seroficom";
    }, []);

  useEffect(() => {
    if (user && user.user) {
      const redirectToRole = (rolePrefix) => {
        switch (rolePrefix) {
          case "ADMIN":
            navigate("/admin");
            break;
          case "TECNICO":
            navigate("/tecnico");
            break;
          case "VENTAS":
            navigate("/vendedor");
            break;
          case "CLIENTE":
            navigate("/cliente");
            break;
          default:
            navigate("/login");
        }
      };
      redirectToRole(user.user.prefix_rol);
    }
  }, [user, navigate]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true); // Activar loading
    setError(""); // Limpiar errores
    try {
      const response = await apiLogin(email, password);
      const userData = response.data;
  
      login(userData);
  
      switch (userData.user.prefix_rol) {
        case "ADMIN":
          navigate("/admin");
          break;
        case "TECNICO":
          navigate("/tecnico");
          break;
        case "VENTAS":
          navigate("/vendedor");
          break;
        case "CLIENTE":
          navigate("/cliente");
          break;
        default:
          navigate("/login");
      }
    } catch (err) {
      // Mostrar el mensaje de error que viene del servidor
      setError(err.message || "Error con la comunicación del servidor. Por favor, contacta con un administrador.");
    } finally {
      setLoading(false); // Desactivar loading
    }
  };

  const spinIcon = <LoadingOutlined style={{ fontSize: 24, color: "#ff4d4f" }} spin />;


  return (
    <div className="flex min-h-screen font-roboto bg-gray-100">
      {/* Imagen con capa de opacidad */}
      <div className="hidden lg:flex lg:w-1/2 relative">
        <img
          src="https://blog.properati.com.ec/wp-content/uploads/2022/12/kiyoshi-49_PpVFXbGg-unsplash-1024x768.jpg"
          alt="Login background"
          className="object-cover w-full h-full"
        />
        <div className="absolute inset-0 bg-red-500 opacity-50"></div>
        {/* Texto SEROFICOM */}
        <div className="absolute inset-0 flex flex-col items-center justify-center">
          <span className="text-white text-6xl font-bold">SEROFICOM</span>
          <span className="text-white text-lg mt-2">TU CONEXIÓN DE CONFIANZA</span>
        </div>
      </div>

      {/* Formulario */}
      <div className="flex items-center justify-center w-full lg:w-1/2 px-6">
        <div className="w-full max-w-lg p-10 bg-white rounded-xl shadow-lg">
          {/* Encabezado */}
          <div className="flex flex-col items-center mb-6">
            <img src={iconLogo} alt="Logo" className="h-32 mb-3" />
            <Typography.Title level={2} className="text-gray-800">
              Bienvenido!
            </Typography.Title>
            <Typography.Text className="text-center text-gray-500">
              Por favor, ingrese sus credenciales para continuar.
            </Typography.Text>
          </div>
          {/* Mensaje de Error */}
          {error && (
            <Alert
              message="Error"
              description={error}
              type="error"
              showIcon
              className="mb-6 animate-fade-in"
              style={{
                borderRadius: "8px",
                fontWeight: "500",
                fontSize: "14px",
              }}
            />
          )}
          {/* Formulario */}
          <form className="space-y-4" onSubmit={handleSubmit}>
            <div>
              <label
                htmlFor="email"
                className="block text-sm font-medium text-gray-700 mb-2"
              >
                Correo electrónico
              </label>
              <Input
                id="email"
                name="email"
                type="email"
                placeholder="Correo electrónico"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                prefix={<MailOutlined />}
                required
                className="w-full h-12 rounded-lg"
              />
            </div>
            <div>
              <label
                htmlFor="password"
                className="block text-sm font-medium text-gray-700 mb-2"
              >
                Contraseña
              </label>
              <Input.Password
                id="password"
                name="password"
                placeholder="Contraseña"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                iconRender={(visible) =>
                  visible ? <EyeTwoTone /> : <EyeInvisibleOutlined />
                }
                prefix={<LockOutlined />}
                className="w-full h-12 rounded-lg"
              />
            </div>
            <Button
              type="default"
              htmlType="submit"
              disabled={loading}
              className="w-full h-12 font-semibold flex items-center justify-center"
              style={{
                backgroundColor: "transparent",
                color: "#ff4d4f",
                borderRadius: "8px",
                border: "2px solid #ff4d4f",
                transition: "all 0.3s ease-in-out",
              }}
            >
              {loading ? (
                <Spin indicator={spinIcon} />
              ) : (
                <>
                  <LoginOutlined style={{ marginRight: "8px" }} />
                  Iniciar Sesión
                </>
              )}
            </Button>
            <div className="version-text">
              V1.0.0-BETA
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;
