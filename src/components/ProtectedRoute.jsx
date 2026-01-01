// src/components/ProtectedRoute.jsx
import React, { useMemo } from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { getCurrentUser } from '../api/auth';
import { clearTokens } from '../api/axios';

export default function ProtectedRoute({ children }) {
  const location = useLocation();

  const user = useMemo(() => getCurrentUser(), []);

  // ✅ 토큰 "존재"가 아니라 "유효(exp 안지남)" 기준으로 보호
  if (!user?.isAuthenticated) {
    // 만료 토큰이면 정리
    clearTokens();
    return <Navigate to="/login" replace state={{ from: location }} />;
  }

  return children;
}
