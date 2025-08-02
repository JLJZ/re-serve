// src/hooks/useAdminProfile.ts
import { useState, useEffect, useCallback } from 'react';
import { useAuth } from '../context/AuthContext';

export interface AdminProfile {
    id: string;
    name: string;
    password: string; 
    lastLogin: Date; 
    email: string; 
    organization: string; 
    accountStatus: 'active' | 'inactive' | 'deactivated';
}
//isfirstlogin

async function fetchWithBasic<T>(url: string, credentials: string, loginType: string, opts: RequestInit = {}): Promise<T> {
  const headers: Record<string, string> = {
    Authorization: `Basic ${credentials}`,
    'Content-Type': 'application/json',
    'x-login-type': loginType,
    ...(opts.headers as Record<string, string> | undefined),
  };

  const res = await fetch(url, {
    ...opts,
    headers,
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

export function useAdminProfile() {
  const { credentials, loginType, logout } = useAuth();
  const [admin, setAdmin] = useState<AdminProfile | null>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  const fetchProfile = useCallback(async () => {
    if (!credentials || loginType !== 'admin') {
      setAdmin(null);
      return;
    }
    setLoading(true);
    setError(null);
    try {
      const data = await fetchWithBasic<{ admin: AdminProfile }>(
        '/api/admins',
        credentials,
        loginType
      );
      setAdmin(data.admin);
    } catch (e) {
      const msg = (e as Error).message;
      setError(msg);
      if (msg.includes('401') || msg.toLowerCase().includes('unauthorized')) {
        logout();
      }
    } finally {
      setLoading(false);
    }
  }, [credentials, loginType, logout]);

  useEffect(() => {
    void fetchProfile();
  }, [fetchProfile]);

  const updateProfile = useCallback(
    async (updates: Partial<AdminProfile>) => {
      if (!credentials || loginType !== 'admin') throw new Error('Not authenticated as admin');
      setLoading(true);
      setError(null);
      try {
        const data = await fetchWithBasic<{ admin: AdminProfile }>(
          '/api/admins',
          credentials,
          loginType,
          {
            method: 'PUT',
            body: JSON.stringify(updates),
          }
        );
        setAdmin(data.admin);
        return data.admin;
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
    admin,
    loading,
    error,
    refetch: fetchProfile,
    updateProfile,
  };
}
