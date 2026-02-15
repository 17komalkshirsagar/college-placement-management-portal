import { appConfig } from '@/config/app.config';

interface ApiRequestOptions extends RequestInit {
  accessToken?: string;
}

export async function apiClient<T>(path: string, options: ApiRequestOptions = {}): Promise<T> {
  try {
    const headers = new Headers(options.headers ?? {});

    headers.set('Content-Type', 'application/json');
    if (options.accessToken) {
      headers.set('Authorization', `Bearer ${options.accessToken}`);
    }

    const response = await fetch(`${appConfig.backendUrl}${path}`, {
      ...options,
      headers,
      cache: 'no-store',
    });

    if (!response.ok) {
      const payload = await response.json().catch(() => ({ message: 'Unexpected API error' }));
      throw new Error(payload.message ?? 'API request failed');
    }

    return (await response.json()) as T;
  } catch (error) {
    if (error instanceof Error) {
      throw error;
    }
    throw new Error('API request failed');
  }
}

