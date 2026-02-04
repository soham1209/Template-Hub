import React from 'react';
import { Navigate, Outlet } from 'react-router';
import useAuthStore from '../../store/useAuthStore';

export const ProtectedRoute = () => {
  const { token } = useAuthStore();

  // If no token exists, redirect to Login
  if (!token) {
    return <Navigate to="/login" replace />;
  }

  // If token exists, render the requested page (Dashboard or Editor)
  return <Outlet />;
};