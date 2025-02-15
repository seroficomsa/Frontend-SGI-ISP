import axios from "axios";

const API_URL = process.env.REACT_APP_API_URL; // Leer la URL base desde el archivo .env

// Obtener un router específico
export const obtenerRouter = async (id_router, token) => {
    try {
      const response = await axios.post(
        `${API_URL}/routers/obtener-router`,
        { id_router }, // Envía el ID en el cuerpo
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      return response.data;
    } catch (error) {
      throw new Error(error.response?.data?.message || "Error al obtener el router.");
    }
  };
  

// Actualizar un router
export const actualizarRouter = async (id, data, token) => {
  try {
    const response = await axios.put(`${API_URL}/routers/${id}`, data, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    return response.data;
  } catch (error) {
    throw new Error(error.response?.data?.message || "Error al actualizar el router.");
  }
};

// Exporta las demás funciones existentes
export const obtenerRouters = async (token) => {
  try {
    const response = await axios.get(`${API_URL}/routers`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    return response.data;
  } catch (error) {
    throw new Error(error.response?.data?.message || "Error al obtener los routers.");
  }
};

export const verificarConexionRouter = async (data, token) => {
  try {
    const response = await axios.post(`${API_URL}/routers/verificar-conexion`, data, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    return response.data;
  } catch (error) {
    throw new Error(error.response?.data?.message || "Error al verificar la conexión.");
  }
};

export const crearRouter = async (data, token) => {
  try {
    const response = await axios.post(`${API_URL}/routers`, data, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    return response.data;
  } catch (error) {
    throw new Error(error.response?.data?.message || "Error al crear el router.");
  }
};

export const eliminarRouter = async (id, token) => {
  try {
    const response = await axios.delete(`${API_URL}/routers/${id}`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    return response.data;
  } catch (error) {
    throw new Error(error.response?.data?.message || "Error al eliminar el router.");
  }
};
