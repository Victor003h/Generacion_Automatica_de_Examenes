import React from "react";
import { Route, Navigate } from "react-router-dom";

interface PrivateRouteProps {
  element: React.ReactElement;
  path: string;
}

const PrivateRoute: React.FC<PrivateRouteProps> = ({
  element,
  path,
  ...rest
}) => {
  const token = localStorage.getItem("token");
  const isAuthenticated = Boolean(token);

  return (
    <Route
      {...rest}
      path={path}
      element={isAuthenticated ? element : <Navigate to="/login" />}
    />
  );
};

export default PrivateRoute;
