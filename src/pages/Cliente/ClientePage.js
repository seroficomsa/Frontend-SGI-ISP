import React from 'react';
import useAuth from '../../hooks/useAuth';

const AdminPage = () => {
  const { user } = useAuth();

  if (!user || !user.user) {
    return <p>No se pudieron cargar los datos del usuario.</p>;
  }

  const { nombres, apellidos, rol } = user.user;

  return (
    <div>
      <h1>Dashboard de Cliente</h1>
      <p>Bienvenido, {nombres} {apellidos}</p>
      <p>Rol: {rol}</p>
    </div>
  );
};

export default AdminPage;
