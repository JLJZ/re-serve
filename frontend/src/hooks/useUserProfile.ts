// src/hooks/useUserProfile.ts
import { useState, useEffect, useCallback } from 'react';
import { useAuth } from '../context/AuthContext';
import { apiRequest } from '../lib/api';
import { User } from '../context/AuthContext';

export interface UserProfile {
    id: string;
    name: string;
    password: string; 
    credits: number; 
    lastLogin: Date; 
    totalBookings: number; 
    email: string; 
    faculty: string; 
    accountStatus: 'active' | 'inactive' | 'deactivated';
    isAdmin: boolean; //inferred 
}
//isfirstlogin

async function fetchWithBasic<T>(url: string, credentials: string, loginType: string): Promise<T> {
  const res = await fetch(url, {
    headers: {
      Authorization: `Basic ${credentials}`,
      'Content-Type': 'application/json',
      'x-login-type': loginType,
    },
  });
  if (!res.ok) {
    const text = await res.text();
    let msg = text;
    try {
      const json = JSON.parse(text);
      msg = json.message || JSON.stringify(json);
    } catch {
      // keep original text if JSON parsing fails
    }
    throw new Error(`${res.status} ${res.statusText}: ${msg}`);
  }
  return res.json();
}

export function useUserProfile() {
  const { credentials, loginType, logout } = useAuth();
  const [user, setUser] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  const fetchProfile = useCallback(async () => {
    if (!credentials || !loginType) {
      setUser(null); 
      return; 

    }
    setLoading(true);
    setError(null);
    try {
      // expecting backend to return { user: { ... } }
      const data = await fetchWithBasic<{ user: UserProfile }>(
        'api/users',
        credentials, 
        loginType 
      );
      setUser(data.user);
      
    } catch (e) {
      const msg = (e as Error).message;
      setError(msg);
      // optional: if unauthorized, clear auth
      if (msg.includes('401') || msg.toLowerCase().includes('unauthorized')) {
        logout();
      }

    } finally {
      setLoading(false);

    }
  }, [credentials, loginType, logout]);

  useEffect(() => {
    if (credentials) {
      void fetchProfile();

    } else {
      setUser(null);

    }
  }, [credentials, fetchProfile]);

  const updateProfile = useCallback(
    async (updates: Partial<UserProfile>) => {
      if (!credentials || !loginType) throw new Error('Not authenticated');
      setLoading(true);
      setError(null);
      try {
        const res = await fetch('/api/users', {
          method: 'PUT',
          headers: {
            Authorization: `Basic ${credentials}`,
            'Content-Type': 'application/json',
            'x-login-type': loginType,
          },
          body: JSON.stringify(updates),
        }); 

        if(!res.ok) {
          const text = await res.text();
          throw new Error(text); 
        }

        const data: {user: UserProfile} = await res.json(); 
        setUser(data.user);
        return data.user;

      } catch (e) {
        setError((e as Error).message);
        throw e;

      } finally {
        setLoading(false);
      }
    },
    [credentials, loginType]
  );

  return {
    user,
    loading,
    error,
    refetch: fetchProfile,
    updateProfile, // optional: for saving edits
    isAdmin: loginType === 'admin', 
  };
}
