// src/components/RequireAuth.js
import React from 'react';
import { Navigate } from 'react-router-dom';

const RequireAuth = ({ children }) => {
  const isAuthenticated = !!localStorage.getItem('authToken'); // Example logic for authentication check
  return isAuthenticated ? children : <Navigate to="/enquiry/login" />;
};

export default RequireAuth;
