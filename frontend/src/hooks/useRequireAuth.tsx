// src/hooks/useRequireAuth.ts
import { useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { useNavigate, useLocation } from 'react-router-dom';

export function useRequireAuth(redirectTo = '/login') {
  const { user, refreshing } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    if (!refreshing && !user) {
      navigate(redirectTo, {
        replace: true,
        state: { from: location.pathname },
      });
    }
  }, [user, refreshing, navigate, location, redirectTo]);
}