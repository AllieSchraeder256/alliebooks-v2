import React from 'react';
import { Navigate, Outlet, useLocation } from 'react-router-dom';

const RequireAuth = () => {
  const token = typeof window !== 'undefined' ? localStorage.getItem('authToken') : null;
  const location = useLocation();

  if (!token) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  return <Outlet />;
};

export default RequireAuth;

