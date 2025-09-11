import React from 'react';
import { Navigate } from 'react-router-dom';

interface ProtectedRouteProps {
  children: React.ReactNode;
}

const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ children }) => {
  const token = localStorage.getItem('token');
  const user = localStorage.getItem('user');
  
  console.log('ProtectedRoute检查:');
  console.log('- Token:', token ? '存在' : '不存在');
  console.log('- Token值:', token);
  console.log('- User:', user ? '存在' : '不存在');
  console.log('- 当前路径:', window.location.pathname);
  
  if (!token) {
    console.log('没有token，重定向到登录页');
    return <Navigate to="/login" replace />;
  }
  
  console.log('认证通过，允许访问');
  return <>{children}</>;
};

export default ProtectedRoute; 