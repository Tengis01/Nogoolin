'use client';

import { createClient } from '@/lib/supabase/client';

// Thin API client for the Fastify backend (single shared pattern — do not
// fetch the API directly from components). Handles: base URL, Bearer token
// from the Supabase session, the {data}/{error,code} envelopes, and 401 →
// login redirect.

const API_URL = process.env.NEXT_PUBLIC_API_URL ?? 'http://localhost:3001/api/v1';

export class ApiError extends Error {
  constructor(
    public readonly status: number,
    public readonly code: string,
    message: string,
  ) {
    super(message);
    this.name = 'ApiError';
  }
}

function redirectToLogin(): never {
  const next = encodeURIComponent(window.location.pathname);
  window.location.assign(`/login?next=${next}`);
  // halt the caller — the page is navigating away
  throw new ApiError(401, 'UNAUTHORIZED', 'Session expired');
}

export async function getAccessToken(): Promise<string> {
  const supabase = createClient();
  const { data } = await supabase.auth.getSession();
  const token = data.session?.access_token;
  if (!token) redirectToLogin();
  return token;
}

async function parseError(res: Response): Promise<ApiError> {
  try {
    const body = (await res.json()) as { error?: string; code?: string };
    return new ApiError(res.status, body.code ?? 'ERROR', body.error ?? res.statusText);
  } catch {
    return new ApiError(res.status, 'ERROR', res.statusText);
  }
}

export async function apiFetch<T>(
  path: string,
  options: { method?: string; body?: unknown; auth?: boolean } = {},
): Promise<T> {
  const headers: Record<string, string> = {};
  if (options.body !== undefined) headers['Content-Type'] = 'application/json';
  if (options.auth) headers['Authorization'] = `Bearer ${await getAccessToken()}`;

  const res = await fetch(`${API_URL}${path}`, {
    method: options.method ?? 'GET',
    headers,
    body: options.body !== undefined ? JSON.stringify(options.body) : undefined,
  });

  if (res.status === 401) redirectToLogin();
  if (!res.ok) throw await parseError(res);
  if (res.status === 204) return undefined as T;
  return (await res.json()) as T;
}

/**
 * Multipart upload with progress — fetch() cannot report upload progress,
 * so this one path uses XMLHttpRequest.
 */
export function apiUpload<T>(
  path: string,
  formData: FormData,
  token: string,
  onProgress: (fraction: number) => void,
): Promise<T> {
  return new Promise((resolve, reject) => {
    const xhr = new XMLHttpRequest();
    xhr.open('POST', `${API_URL}${path}`);
    xhr.setRequestHeader('Authorization', `Bearer ${token}`);
    xhr.upload.onprogress = (e) => {
      if (e.lengthComputable) onProgress(e.loaded / e.total);
    };
    xhr.onload = () => {
      if (xhr.status === 401) {
        redirectToLogin();
        return;
      }
      let body: { error?: string; code?: string } = {};
      try {
        body = JSON.parse(xhr.responseText) as typeof body;
      } catch {
        /* non-JSON body */
      }
      if (xhr.status >= 200 && xhr.status < 300) {
        resolve(body as T);
      } else {
        reject(
          new ApiError(xhr.status, body.code ?? 'ERROR', body.error ?? xhr.statusText),
        );
      }
    };
    xhr.onerror = () =>
      reject(new ApiError(0, 'NETWORK_ERROR', 'Сүлжээний алдаа — дахин оролдоно уу'));
    xhr.send(formData);
  });
}
