import React, { createContext, useState, useEffect } from "react";
import axios from "axios";
import { Spin, Modal } from "antd";

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [isLoading, setIsLoading] = useState(true); // Controla la carga inicial
  const [isLoggingOut, setIsLoggingOut] = useState(false); // Controla el modal de cierre de sesión

  const login = (userData) => {
    setUser(userData);
    localStorage.setItem("user", JSON.stringify(userData));
  };

  const logout = async () => {
    setIsLoggingOut(true);
    try {
      if (user?.access_token) {
        await axios.post(`${process.env.REACT_APP_API_URL}/logout`, null, {
          headers: {
            Authorization: `Bearer ${user.access_token}`,
          },
        });
      }
    } catch (error) {
      console.error("Error al cerrar sesión:", error.message);
    } finally {
      setUser(null);
      localStorage.removeItem("user");
      setTimeout(() => {
        setIsLoggingOut(false);
      }, 1000); // Breve retraso para mostrar el spinner
    }
  };

  const validateToken = async () => {
    const storedUser = localStorage.getItem("user");
    if (storedUser) {
      const userData = JSON.parse(storedUser);
      try {
        const response = await axios.get(`${process.env.REACT_APP_API_URL}/user/me`, {
          headers: { Authorization: `Bearer ${userData.access_token}` },
        });
        if (response.status === 200) {
          setUser({ ...userData, user: response.data.data });
        } else {
          throw new Error("Token inválido");
        }
      } catch (error) {
        console.error("Error al validar el token:", error.message);
        logout();
      }
    }
    setIsLoading(false);
  };

  const axiosInterceptor = () => {
    axios.interceptors.response.use(
      (response) => response,
      (error) => {
        if (error.response?.data?.message === "Unauthenticated.") {
          logout();
        }
        return Promise.reject(error);
      }
    );
  };

  useEffect(() => {
    axiosInterceptor();
    validateToken();
  }, []);

  return (
    <AuthContext.Provider value={{ user, login, logout, isLoading }}>
      {isLoading ? (
        <div
          style={{
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            height: "100vh",
          }}
        >
          <Spin tip="Validando sesión..." />
        </div>
      ) : (
        <>
          {children}
          <Modal
            open={isLoggingOut}
            centered
            footer={null}
            closable={false}
          >
            <div
              style={{
                display: "flex",
                flexDirection: "column",
                justifyContent: "center",
                alignItems: "center",
              }}
            >
              <Spin
                size="large"
                tip={<span style={{ color: "red", fontWeight: "bold" }}>Cerrando sesión...</span>}
                style={{
                  color: "red",
                }}
              />
            </div>
          </Modal>
        </>
      )}
    </AuthContext.Provider>
  );
};
