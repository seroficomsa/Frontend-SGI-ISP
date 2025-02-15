import axios from 'axios';

const API_URL = process.env.REACT_APP_API_URL; // Leer la URL base desde el archivo .env

export const login = async (email, password) => {
  try {
    const response = await axios.post(`${API_URL}/login`, {
      correo_electronico: email,
      password,
    });
    return response.data;
  } catch (error) {
    throw new Error(error.response?.data?.message || 'Error al iniciar sesión');
  }
};

export const logout = async (token) => {
  try {
    const response = await axios.post(`${API_URL}/logout`, null, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    return response.data;
  } catch (error) {
    throw new Error(error.response?.data?.message || 'Error al cerrar sesión');
  }
};

export const getUserData = async (token) => {
  try {
    const response = await axios.get(`${API_URL}/user/me`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    return response.data;
  } catch (error) {
    throw new Error(error.response?.data?.message || 'Error al obtener datos del usuario');
  }
};

export default { login, logout, getUserData };
