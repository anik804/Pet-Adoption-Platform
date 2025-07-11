import React from 'react';
import { Navigate } from 'react-router';
import useAuth from '../Hooks/useAuth';

const AdminRoute = ({ children }) => {
  const { user, role, loading } = useAuth();

  if (loading) {
    return <span className="loading loading-spinner loading-xl"></span>;
  }

  // If no user, redirect to login
  if (!user) {
    return <Navigate to="/login" />;
  }

  // Check if user has admin role
  if (role !== 'admin') {
    // Redirect non-admin users to user dashboard
    return <Navigate to="/dashboard" />;
  }

  return children;
};

export default AdminRoute;
