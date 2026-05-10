import { QueryClient } from '@tanstack/react-query';
import { Platform } from 'react-native';

const API_URL = Platform.OS === 'web'
  ? '/api'
  : `http://localhost:3000/api`;

export function getApiUrl(): string {
  return API_URL;
}

export async function apiRequest(method: string, path: string, body?: unknown) {
  const url = `${API_URL}${path}`;
  const response = await fetch(url, {
    method,
    headers: { 'Content-Type': 'application/json' },
    body: body ? JSON.stringify(body) : undefined,
  });
  if (!response.ok) {
    throw new Error(`API Error: ${response.status}`);
  }
  return response.json();
}

async function defaultFetcher({ queryKey }: { queryKey: readonly unknown[] }) {
  const path = queryKey[0] as string;
  const url = `${API_URL}${path}`;
  const response = await fetch(url);
  if (!response.ok) throw new Error(`API Error: ${response.status}`);
  return response.json();
}

export const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      queryFn: defaultFetcher,
      staleTime: 1000 * 60 * 5,
      retry: 1,
    },
  },
});
