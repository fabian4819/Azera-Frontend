import { useState, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';

export interface TalentCreator {
  name: string;
  phone: string;
}

export function useTalentAuth() {
  const navigate = useNavigate();

  const [token, setToken] = useState<string | null>(() =>
    localStorage.getItem('azera_creator_token')
  );

  const [creator, setCreator] = useState<TalentCreator | null>(() => {
    const stored = localStorage.getItem('azera_creator');
    if (!stored) return null;
    try {
      return JSON.parse(stored) as TalentCreator;
    } catch {
      return null;
    }
  });

  const login = useCallback((newToken: string, newCreator: TalentCreator) => {
    localStorage.setItem('azera_creator_token', newToken);
    localStorage.setItem('azera_creator', JSON.stringify(newCreator));
    setToken(newToken);
    setCreator(newCreator);
  }, []);

  const logout = useCallback(() => {
    localStorage.removeItem('azera_creator_token');
    localStorage.removeItem('azera_creator');
    setToken(null);
    setCreator(null);
    navigate('/talent/login');
  }, [navigate]);

  return { token, creator, login, logout };
}
