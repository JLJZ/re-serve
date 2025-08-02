// src/lib/api.ts
import { useAuth } from '../context/AuthContext';

// standalone function (for non-hook usage)
export async function apiRequest<T>(
  path: string,
  opts: RequestInit = {},
  basicCred?: string | null
): Promise<T> {
  const headers: Record<string, string> = {
    'Content-Type': 'application/json',
    ...(opts.headers as Record<string, string> | undefined),
  };
  if (basicCred) {
    headers['Authorization'] = `Basic ${basicCred}`;
  }
  const res = await fetch(path, {
    ...opts,
    headers,
  });
  if (!res.ok) {
    const body = await res.text();
    let message = body;
    try {
      const json = JSON.parse(body);
      message = json.message || JSON.stringify(json);
    } catch {
        // keep original text if JSON parsing fails
        message = body; 
    }
    throw new Error(`${res.status}: ${message}`);
  }
  return res.json();
}
