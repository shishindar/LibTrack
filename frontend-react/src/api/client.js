const BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

let authToken = null;
let onUnauthorized = null;

// Store JWT token in memory
export function setAuthToken(token) {
  authToken = token;
}

// Called when backend returns 401
export function setUnauthorizedHandler(callback) {
  onUnauthorized = callback;
}

async function request(path, { method = 'GET', body, params } = {}) {
  let url = `${BASE_URL}${path}`;

  if (params) {
    const qs = new URLSearchParams(
      Object.entries(params).filter(([, value]) => value !== undefined && value !== '')
    ).toString();

    if (qs) url += `?${qs}`;
  }

  const headers = {
    'Content-Type': 'application/json',
  };

  if (authToken) {
    headers.Authorization = `Bearer ${authToken}`;
  }

  console.log("========== API REQUEST ==========");
  console.log("URL:", url);
  console.log("TOKEN:", authToken);
  console.log("HEADERS:", headers);

  const res = await fetch(url, {
    method,
    headers,
    body: body ? JSON.stringify(body) : undefined,
  });

  const data = await res.json().catch(() => ({}));

  if (res.status === 401) {
    if (onUnauthorized) {
      onUnauthorized(data.message);
    }
  }

  if (!res.ok || data.success === false) {
    throw new Error(
      data.message ||
      `Request failed (${res.status})`
    );
  }

  return data;
}

export const api = {
  get: (path, params) => request(path, { method: 'GET', params }),

  post: (path, body) => request(path, { method: 'POST', body }),

  put: (path, body) => request(path, { method: 'PUT', body }),

  patch: (path, body) => request(path, { method: 'PATCH', body }),

  delete: (path) => request(path, { method: 'DELETE' }),
};