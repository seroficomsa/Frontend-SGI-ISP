import axios from "axios";

const API_URL = process.env.REACT_APP_API_URL;

export const obtenerOnts = async (token) => {
  try {
    const response = await axios.get(`${API_URL}/onts/obtener`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    return response.data;
  } catch (error) {
    console.error("Error al obtener ONUs:", error);
    throw error;
  }
};

export const crearOnt = async (data, token) => {
  try {
    const response = await axios.post(`${API_URL}/onts/crear`, data, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    return response.data;
  } catch (error) {
    console.error("Error al crear ONU:", error);
    throw error;
  }
};

export const actualizarOnt = async (data, token) => {
  try {
    const response = await axios.put(`${API_URL}/onts/actualizar`, data, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    return response.data;
  } catch (error) {
    console.error("Error al actualizar ONU:", error);
    throw error;
  }
};

export const eliminarOnt = async (id_onu, token) => {
  try {
    const response = await axios.delete(`${API_URL}/onts/eliminar`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
      data: { id_onu },
    });
    return response.data;
  } catch (error) {
    console.error("Error al eliminar ONU:", error);
    throw error;
  }
};