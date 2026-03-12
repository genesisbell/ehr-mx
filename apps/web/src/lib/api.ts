import { getSession } from 'next-auth/react';

/**
 * Typed fetch wrapper for the EHR API.
 * Base URL is configured via NEXT_PUBLIC_API_URL or falls back to /api (proxy).
 */
const API_BASE =
  typeof window !== 'undefined'
    ? '/api'
    : (process.env.NEXT_PUBLIC_API_URL ?? 'http://localhost:3001');

export async function apiFetch<T>(
  path: string,
  init?: RequestInit,
  accessToken?: string,
): Promise<T> {
  const headers: Record<string, string> = {
    'Content-Type': 'application/json',
    ...(init?.headers as Record<string, string>),
  };

  if (accessToken) {
    headers['Authorization'] = `Bearer ${accessToken}`;
  }

  const res = await fetch(`${API_BASE}${path}`, {
    ...init,
    headers,
  });

  if (!res.ok) {
    const error = await res.json().catch(() => ({ message: res.statusText }));
    throw new Error(error?.message ?? 'API request failed');
  }

  return res.json() as Promise<T>;
}

/**
 * Client-side apiFetch that auto-injects the session's access token.
 */
export async function authFetch<T>(
  path: string,
  init?: RequestInit,
): Promise<T> {
  const session = await getSession();
  return apiFetch<T>(path, init, session?.accessToken);
}
