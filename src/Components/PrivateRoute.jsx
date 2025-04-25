import React from "react";
import { Navigate, Outlet } from "react-router-dom";

// Utility function to check if token exists
const isAuthenticated = () => {
  const token = localStorage.getItem("access_token");
  return Boolean(token);
};

// PrivateRoute component
const PrivateRoute = () => {
  return isAuthenticated() ? <Outlet /> : <Navigate to="/Login" />;
};

export default PrivateRoute;
