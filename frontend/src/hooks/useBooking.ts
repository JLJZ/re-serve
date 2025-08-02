// src/hooks/useBooking.ts
import { useState, useEffect, useCallback } from 'react';
import { useAuth } from '../context/AuthContext';

export interface Booking {
    id: string,
    facilityId: string,
    facilityName: string; 
    facilityType: string; 
    bookerId: string; 
    bookerName: string; 
    date: Date; 
    startTime: string;
    endTime: string; 
    status: string; 
    creditCost: number; 
    location: string; 
    description?: string; 
    image?: string;  
}

async function fetchWithBasic<T>(
  url: string,
  credentials: string,
  loginType: string,
  opts: RequestInit = {}
): Promise<T> {
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

export function useBooking(bookingId: string | undefined) {
  const { credentials, loginType, logout } = useAuth();
  const [booking, setBooking] = useState<Booking | null>(null);
  const [loading, setLoading] = useState<boolean>(!!bookingId);
  const [error, setError] = useState<string | null>(null);
  const [canceling, setCanceling] = useState(false);

  const fetchBooking = useCallback(async () => {
    if (!bookingId || !credentials || !loginType) return;
    setLoading(true);
    setError(null);
    try {
      const data = await fetchWithBasic<{ booking: Booking }>(
        `/api/bookings/${bookingId}`,
        credentials,
        loginType
      );
      setBooking(data.booking);
    } catch (e) {
      const msg = (e as Error).message;
      setError(msg);
      if (msg.includes('401') || msg.toLowerCase().includes('unauthorized')) {
        logout();
      }
    } finally {
      setLoading(false);
    }
  }, [bookingId, credentials, loginType, logout]);

  useEffect(() => {
    void fetchBooking();
  }, [fetchBooking]);

  const cancelBooking = useCallback(async () => {
    if (!bookingId || !credentials || !loginType) throw new Error('Cannot cancel');
    setCanceling(true);
    try {
      await fetchWithBasic<unknown>(
        `/api/bookings/${bookingId}`,
        credentials,
        loginType,
        { method: 'DELETE' }
      );
      // Optionally refetch or null out
      setBooking(null);
    } finally {
      setCanceling(false);
    }
  }, [bookingId, credentials, loginType]);

  return {
    booking,
    loading,
    error,
    refetch: fetchBooking,
    cancelBooking,
    canceling,
  };
}
