import axios from "axios";

const API_URL = process.env.REACT_APP_API_URL;

// Obtener todos los planes
export const listarPlanes = async (token) => {
    try {
      const response = await axios.get(`${API_URL}/planes`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      return response.data;
    } catch (error) {
      console.error("Error al listar los planes:", error);
      throw error.response?.data || error.message;
    }
  };

  export const repararPlan = async (idPlan, token) => {
    try {
      const response = await axios.put(`${API_URL}/planes/reparar/${idPlan}`, {}, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      return response.data;
    } catch (error) {
      console.error("Error al reparar el plan:", error);
      throw error.response?.data || error.message;
    }
  };
  

// Crear un nuevo plan
export const crearPlan = async (data, token) => {
  try {
    const response = await axios.post(`${API_URL}/planes/crear`, data, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    return response.data;
  } catch (error) {
    console.error("Error al crear el plan:", error);
    throw error.response?.data || error.message;
  }
};

// Actualizar un plan existente
export const actualizarPlan = async (idPlan, data, token) => {
  try {
    const response = await axios.put(`${API_URL}/planes/${idPlan}`, data, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    return response.data;
  } catch (error) {
    console.error("Error al actualizar el plan:", error);
    throw error.response?.data || error.message;
  }
};

// Eliminar un plan
export const eliminarPlan = async (idPlan, token) => {
  try {
    const response = await axios.delete(`${API_URL}/planes/${idPlan}`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    return response.data;
  } catch (error) {
    console.error("Error al eliminar el plan:", error);
    throw error.response?.data || error.message;
  }
};
