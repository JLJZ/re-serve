// src/context/AuthContext.tsx
import { LargeNumberLike } from 'crypto';
import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';

export type LoginType = 'admin' | 'user'; 

export interface User {
    id: string;
    name: string;
    password: string; 
    credits: number; 
    lastLogin: Date; 
    totalBookings: number; 
    email: string; 
    faculty: string; 
    accountStatus: 'active' | 'inactive' | 'deactivated';
}

interface AuthContextValue {
  user: User | null;
  loginType: LoginType | null; // 'admin' or 'user'
  login: (username: string, password: string, loginType: LoginType) => Promise<User>;
  logout: () => void;
  refreshing: boolean;
}

const AuthContext = createContext<AuthContextValue | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [loginType, setLoginType] = useState<LoginType | null>(null); 
  const [refreshing, setRefreshing] = useState(false);

  // hydrate from sessionStorage so page reload doesn't lose login (optional)
  useEffect(() => {
    const storedType = sessionStorage.getItem('loginType') as LoginType | null; 
    if (storedType) {
      // validate by fetching /login
      setLoginType(storedType); 
      (async () => {
        try {
          setRefreshing(true);
          const res = await fetch('/api/auth/login', {
            headers: {
              'Content-Type': 'application/json',
              'x-login-type': storedType, 
            },
          });
          if (!res.ok) throw new Error('Invalid credentials');
          const data = await res.json();
          setUser(data.user);
        } catch {
          setUser(null);
          setLoginType(null); 
          sessionStorage.removeItem('loginType');
        } finally {
          setRefreshing(false);
        }
      })();
    }
  }, []);

  const login = async (username: string, password: string, type: LoginType): Promise<User> => {
    const raw = `${username}:${password}`;
    const res = await fetch('/api/auth/login', {
      headers: {
        'Content-Type': 'application/json',
        'x-login-type': type, 
      },
    });

    if (!res.ok) {
      throw new Error('Login failed');
    }

    const data: { user: User} = await res.json();
    setUser(data.user);
    setLoginType(type);
    sessionStorage.setItem('loginType', type);
    return data.user; 
  };

  const logout = () => {
    setUser(null);
    sessionStorage.removeItem('loginType'); 
    // optional backend notify
    fetch('/api/auth/logout', { method: 'POST' });
  };

  return (
    <AuthContext.Provider
      value={{ user, loginType, login, logout, refreshing }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used within AuthProvider');
  return ctx;
}