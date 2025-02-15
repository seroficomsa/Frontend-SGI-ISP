import axios from "axios";

const API_URL = process.env.REACT_APP_API_URL; // Leer la URL base desde el archivo .env

export const obtenerLogs = async (token) => {
    try {
        const response = await axios.get(`${API_URL}/obtener-acciones-realizadas`,{
            headers: {
                Authorization: `Bearer ${token}`,
              },
        });
        return response.data;
    } catch (error) {
        throw new Error(error.response?.data?.message || "Error al obtener los datos");
    }
};
