// src/api/httpClient.ts
const API_BASE_URL = "https://app.tablecrm.com/api/v1";

type HttpMethod = "GET" | "POST";

function buildUrl(path: string, params?: Record<string, unknown>): string {
  const url = new URL(API_BASE_URL + path);
  if (params) {
    Object.entries(params).forEach(([key, value]) => {
      if (value !== undefined && value !== null && value !== "") {
        url.searchParams.set(key, String(value));
      }
    });
  }
  return url.toString();
}

async function request<T>(
  method: HttpMethod,
  path: string,
  options?: {
    params?: Record<string, unknown>;
    body?: unknown;
  }
): Promise<T> {
  const url = buildUrl(path, options?.params);

  const res = await fetch(url, {
    method,
    headers:
      method === "POST"
        ? {
            "Content-Type": "application/json",
          }
        : undefined,
    body: method === "POST" ? JSON.stringify(options?.body ?? {}) : undefined,
  });

  if (!res.ok) {
    const text = await res.text().catch(() => "");
    throw new Error(`HTTP ${res.status}: ${text}`);
  }

  return (await res.json()) as T;
}

export function get<T>(
  path: string,
  params?: Record<string, unknown>
): Promise<T> {
  return request<T>("GET", path, { params });
}

export function post<T>(
  path: string,
  body: unknown,
  params?: Record<string, unknown>
): Promise<T> {
  return request<T>("POST", path, { params, body });
}
