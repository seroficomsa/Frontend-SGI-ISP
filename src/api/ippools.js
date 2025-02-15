import axios from "axios";

const API_URL = process.env.REACT_APP_API_URL; // Leer la URL base desde el archivo .env

export const listarIPPools = async (token) => {
    try {
        const response = await axios.get(`${API_URL}/ippools`, {
            headers: {
                Authorization: `Bearer ${token}`,
            },
        });
        return response.data;
    } catch (error) {
        throw new Error(error.response?.data?.message || "Error al listar los IP Pools");
    }
};

export const crearIPPool = async (token, data) => {
    try {
        const response = await axios.post(`${API_URL}/ippools`, data, {
            headers: {
                Authorization: `Bearer ${token}`,
            },
        });
        return response.data;
    } catch (error) {
        throw new Error(error.response?.data?.message || "Error al crear el IP Pool");
    }
};

export const actualizarIPPool = async (token, id, data) => {
    try {
        const response = await axios.put(`${API_URL}/ippools/${id}`, data, {
            headers: {
                Authorization: `Bearer ${token}`,
            },
        });
        return response.data;
    } catch (error) {
        throw new Error(error.response?.data?.message || "Error al actualizar el IP Pool");
    }
};

export const eliminarIPPool = async (token, id) => {
    try {
        const response = await axios.delete(`${API_URL}/ippools/${id}`, {
            headers: {
                Authorization: `Bearer ${token}`,
            },
        });
        return response.data;
    } catch (error) {
        throw new Error(error.response?.data?.message || "Error al eliminar el IP Pool");
    }
};

// Nueva función para reparar el IP Pool
export const repararIPPool = async (token, id) => {
    try {
        const response = await axios.post(
            `${API_URL}/ippools/reparar/${id}`,
            {}, // No se envían datos en el body
            {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            }
        );
        return response.data;
    } catch (error) {
        throw new Error(error.response?.data?.message || "Error al reparar el IP Pool");
    }
};