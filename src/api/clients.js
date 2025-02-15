import axios from "axios";

const API_URL = process.env.REACT_APP_API_URL;

// Obtener clientes
export const obtenerClientes = async (token) => {
    try {
        const response = await axios.get(`${API_URL}/clientes`, {
            headers: {
                Authorization: `Bearer ${token}`,
            },
        });
        return response.data;
    } catch (error) {
        throw new Error(error.response?.data?.message || "Error al obtener clientes.");
    }
};

export const obtenerInformacionCliente = async (id, token) => {
    try {
        const response = await axios.get(`${API_URL}/clientes/${id}`, {
            headers: {
                Authorization: `Bearer ${token}`,
            },
        });
        return response.data;
    } catch (error) {
        throw new Error(error.response?.data?.message || "Error al obtener la información del cliente.");
    }
};


export const verificarCorreo = async (correo, token) => {
    try {
        const response = await axios.post(
            `${API_URL}/clientes/verificar-correo`,
            { correo_electronico: correo },
            {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            }
        );
        return response.data;
    } catch (error) {
        throw new Error(error.response?.data?.message || "Error al verificar el correo.");
    }
};

// Crear cliente
export const crearCliente = async (data, token) => {
    try {
        const response = await axios.post(`${API_URL}/clientes`, data, {
            headers: {
                Authorization: `Bearer ${token}`,
            },
        });
        return response.data;
    } catch (error) {
        throw new Error(error.response?.data?.message || "Error al crear el cliente.");
    }
};

// Actualizar cliente
export const actualizarCliente = async (id, data, token) => {
    try {
        const response = await axios.put(`${API_URL}/clientes/${id}`, data, {
            headers: {
                Authorization: `Bearer ${token}`,
            },
        });
        return response.data;
    } catch (error) {
        throw new Error(error.response?.data?.message || "Error al actualizar el cliente.");
    }
};

// Eliminar cliente
export const eliminarCliente = async (id, payload, token) => {
    try {
      const response = await axios.delete(`${API_URL}/clientes/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
        data: payload, // <-- ENVIAMOS { id_usuario_auditor: ... } EN EL BODY DEL DELETE
      });
      return response.data;
    } catch (error) {
      throw new Error(error.response?.data?.message || "Error al eliminar el cliente.");
    }
  };

  export async function repararCliente(idCliente, token) {
    try {
      const response = await axios.post(
        `${API_URL}/clientes/${idCliente}/reparar`,
        {},
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      return response.data;
    } catch (error) {
      throw new Error(error.response?.data?.message || "Error al reparar el cliente.");
    }
  }