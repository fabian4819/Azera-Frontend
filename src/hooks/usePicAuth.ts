import { useState, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';

export interface PicUser {
  name: string;
  email: string;
}

export function usePicAuth() {
  const navigate = useNavigate();

  const [token, setToken] = useState<string | null>(() =>
    localStorage.getItem('azera_pic_token')
  );

  const [pic, setPic] = useState<PicUser | null>(() => {
    const stored = localStorage.getItem('azera_pic');
    if (!stored) return null;
    try {
      return JSON.parse(stored) as PicUser;
    } catch {
      return null;
    }
  });

  const login = useCallback((newToken: string, newPic: PicUser) => {
    localStorage.setItem('azera_pic_token', newToken);
    localStorage.setItem('azera_pic', JSON.stringify(newPic));
    setToken(newToken);
    setPic(newPic);
  }, []);

  const logout = useCallback(() => {
    localStorage.removeItem('azera_pic_token');
    localStorage.removeItem('azera_pic');
    setToken(null);
    setPic(null);
    navigate('/login');
  }, [navigate]);

  return { token, pic, login, logout };
}
