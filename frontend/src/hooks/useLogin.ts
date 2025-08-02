// src/hooks/useLogin.ts
import { useState } from 'react';
import { useAuth, LoginType } from '../context/AuthContext';

export function useLogin() {
  const { login } = useAuth();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const execute = async (username: string, password: string, loginType: LoginType) => {
    setError(null);
    setLoading(true);
    try {
        const  user = await login(username, password, loginType); //returns Users
        return user; 

    } catch (e) {
      setError((e as Error).message);
      throw e;

    } finally {
      setLoading(false);
      
    }
  };

  return { login: execute, loading, error };
}
