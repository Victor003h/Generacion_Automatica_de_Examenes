// Importa las librerías necesarias de React y otros módulos
import React from "react";
import { Navigate } from "react-router-dom";

// Define el componente funcional para rutas privadas
const PrivateRoute: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  // Verifica si el usuario está autenticado comprobando el token en el almacenamiento local
  const isAuthenticated = !!localStorage.getItem("authToken");

  // Si el usuario está autenticado, renderiza los componentes hijos, de lo contrario, redirige a la página de inicio de sesión
  return isAuthenticated ? <>{children}</> : <Navigate to="/login" />;
};

export default PrivateRoute;
