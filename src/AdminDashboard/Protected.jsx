import React from 'react';
import { Navigate, Outlet } from 'react-router-dom';

const ProtectedRoute = () => {
  // Check if admin is logged in
  const isAuthenticated = () => {
    const adminToken = localStorage.getItem('adminToken');
    return !!adminToken; // Returns true if token exists
  };

  return isAuthenticated() ? <Outlet /> : <Navigate to="/adminlogin" replace />;
};

export default ProtectedRoute;