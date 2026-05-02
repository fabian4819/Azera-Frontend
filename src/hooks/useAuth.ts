import { useState, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';

export interface AdminUser {
  name: string;
  email: string;
}

export function useAuth() {
  const navigate = useNavigate();

  const [token, setToken] = useState<string | null>(() =>
    localStorage.getItem('azera_token')
  );

  const [admin, setAdmin] = useState<AdminUser | null>(() => {
    const stored = localStorage.getItem('azera_admin');
    if (!stored) return null;
    try {
      return JSON.parse(stored) as AdminUser;
    } catch {
      return null;
    }
  });

  const login = useCallback((newToken: string, newAdmin: AdminUser) => {
    localStorage.setItem('azera_token', newToken);
    localStorage.setItem('azera_admin', JSON.stringify(newAdmin));
    setToken(newToken);
    setAdmin(newAdmin);
  }, []);

  const logout = useCallback(() => {
    localStorage.removeItem('azera_token');
    localStorage.removeItem('azera_admin');
    setToken(null);
    setAdmin(null);
    navigate('/admin/login');
  }, [navigate]);

  return { token, admin, login, logout };
}
