import axios from "axios";

const API_URL = process.env.REACT_APP_API_URL; // Leer la URL base desde el archivo .env

// Obtener todas las OLTs
export const obtenerOLTs = async (token) => {
  try {
    const response = await axios.post(
      `${API_URL}/olts/obtener`,
      {},
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );
    return response.data;
  } catch (error) {
    throw new Error(error.response?.data?.message || "Error al obtener las OLTs.");
  }
};

// Obtener una OLT específica
export const obtenerOLT = async (id_olt, token) => {
  try {
    const response = await axios.post(
      `${API_URL}/olts/obtener-olt`,
      { id_olt }, // Se envía el ID en el cuerpo
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );
    return response.data;
  } catch (error) {
    throw new Error(error.response?.data?.message || "Error al obtener la OLT.");
  }
};

// Crear una nueva OLT
export const crearOLT = async (data, token) => {
  try {
    const response = await axios.post(`${API_URL}/olts/crear`, data, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    return response.data;
  } catch (error) {
    throw new Error(error.response?.data?.message || "Error al crear la OLT.");
  }
};

// Actualizar una OLT existente
export const actualizarOLT = async (data, token) => {
  try {
    const response = await axios.post(`${API_URL}/olts/actualizar`, data, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    return response.data;
  } catch (error) {
    throw new Error(error.response?.data?.message || "Error al actualizar la OLT.");
  }
};

// Eliminar una OLT (se pasa el ID en el cuerpo)
export const eliminarOLT = async (id_olt, token) => {
  try {
    const response = await axios.post(
      `${API_URL}/olts/eliminar`,
      { id_olt },
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );
    return response.data;
  } catch (error) {
    throw new Error(error.response?.data?.message || "Error al eliminar la OLT.");
  }
};
