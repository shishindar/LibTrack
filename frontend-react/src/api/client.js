const BASE_URL =
  import.meta.env.VITE_API_URL || "http://localhost:5000/api";

const ACCESS_TOKEN_KEY = "library_tracker_access_token";
const REFRESH_TOKEN_KEY = "library_tracker_refresh_token";


let authToken = localStorage.getItem("library_tracker_access_token");
let refreshToken = localStorage.getItem("library_tracker_refresh_token");

let onUnauthorized = null;

export function setUnauthorizedHandler(callback) {
  onUnauthorized = callback;
}

// Save tokens
export function setAuthToken(access, refresh) {
  authToken = access;
  refreshToken = refresh;

  if (access) {
    localStorage.setItem(ACCESS_TOKEN_KEY, access);
  }

  if (refresh) {
    localStorage.setItem(REFRESH_TOKEN_KEY, refresh);
  }
}

// Clear tokens
export function clearAuthToken() {
  authToken = null;
  refreshToken = null;

  localStorage.removeItem(ACCESS_TOKEN_KEY);
  localStorage.removeItem(REFRESH_TOKEN_KEY);
}
// Refresh Access Token
async function refreshAccessToken() {
  if (!refreshToken) return false;

  try {
    const res = await fetch(`${BASE_URL}/auth/refresh`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        refreshToken,
      }),
    });

    const data = await res.json();

    if (!res.ok || !data.success) {
  clearAuthToken();
  return false;
}

    authToken = data.accessToken;

    localStorage.setItem(ACCESS_TOKEN_KEY, data.accessToken);

    return true;

  } catch (err) {
    console.error("Refresh failed:", err);
    clearAuthToken();
    return false;
  }
}

async function request(path, options = {}, retry = true) {
  let url = `${BASE_URL}${path}`;

  if (options.params) {
    const qs = new URLSearchParams(
      Object.entries(options.params).filter(
        ([, value]) => value !== undefined && value !== ""
      )
    ).toString();

    if (qs) {
      url += `?${qs}`;
    }
  }

  const headers = {};

if (!(options.body instanceof FormData)) {
  headers["Content-Type"] = "application/json";
}

if (authToken) {
  headers.Authorization = `Bearer ${authToken}`;
}

const res = await fetch(url, {
  method: options.method || "GET",
  headers,
  body: options.body
    ? options.body instanceof FormData
      ? options.body
      : JSON.stringify(options.body)
    : undefined,
});

 // Don't treat login/register failures as session expiry
const isAuthRequest =
  path === "/auth/login" ||
  path === "/auth/register";

// Handle expired access token only for protected APIs
if (res.status === 401 && retry && !isAuthRequest) {

  const refreshed = await refreshAccessToken();

  if (refreshed) {
    console.log("🔄 Retrying request:", path);
    return request(path, options, false);
  }

  clearAuthToken();

  if (onUnauthorized) {
    onUnauthorized("Session expired. Please sign in again.");
  }

  throw new Error("Session expired. Please sign in again.");
}

  const data = await res.json().catch(() => ({}));

  if (!res.ok || data.success === false) {
    throw new Error(
      data.message ||
      `Request failed (${res.status})`
    );
  }

  return data;
}

export const api = {
  get: (path, params) =>
    request(path, {
      method: "GET",
      params,
    }),

  post: (path, body) =>
    request(path, {
      method: "POST",
      body,
    }),

  put: (path, body) =>
    request(path, {
      method: "PUT",
      body,
    }),

  patch: (path, body) =>
    request(path, {
      method: "PATCH",
      body,
    }),

  delete: (path) =>
    request(path, {
      method: "DELETE",
    }),
};