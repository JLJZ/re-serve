import React from 'react';
import { Navigate } from 'react-router-dom';
const ProtectedRoute = ({
  user,
  userRole,
  children
}) => {
  if (!user) {
    return <Navigate to="/login" replace />;
  }
  if (userRole && user.role !== userRole) {
    return user.role === 'admin' ? <Navigate to="/admin/dashboard" replace /> : <Navigate to="/user/dashboard" replace />;
  }
  return children;
};
export default ProtectedRoute;