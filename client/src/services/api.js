function buildApiBaseUrl(rawUrl) {
  if (!rawUrl) return "/api";

  const trimmed = rawUrl.trim();
  const normalized = trimmed.replace(/\/+$/, "");
  if (!normalized) return "/api";

  return normalized.endsWith("/api") ? normalized : `${normalized}/api`;
}

const BASE_URL = buildApiBaseUrl(import.meta.env.VITE_API_URL);

async function request(endpoint, { method = "GET", body, headers = {}, ...options } = {}) {
  const token = localStorage.getItem("token");
  const isFormData = body instanceof FormData;

  const config = {
    method,
    headers: {
      ...(isFormData ? {} : { "Content-Type": "application/json" }),
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
      ...headers,
    },
    ...options,
  };

  if (body !== undefined) {
    config.body = isFormData ? body : JSON.stringify(body);
  }

  const normalizedEndpoint = endpoint.startsWith("/") ? endpoint : `/${endpoint}`;
  const response = await fetch(`${BASE_URL}${normalizedEndpoint}`, config);

  let payload = null;
  let rawText = "";
  try {
    rawText = await response.text();
    payload = rawText ? JSON.parse(rawText) : null;
  } catch {
    payload = rawText || null;
  }

  if (!response.ok) {
    const apiMessage = typeof payload === "object" && payload ? payload.message || payload.error : null;
    const fallbackMessage = typeof payload === "string" && payload.trim() ? payload.slice(0, 180) : null;
    throw new Error(apiMessage || fallbackMessage || `Сталася помилка запиту (${response.status})`);
  }

  if (payload && typeof payload === "object" && payload.success === false) {
    throw new Error(payload.message || "Сталася помилка запиту");
  }

  return payload;
}

export function get(endpoint, options) {
  return request(endpoint, { ...options, method: "GET" });
}

export function post(endpoint, body, options) {
  return request(endpoint, { ...options, method: "POST", body });
}

export function patch(endpoint, body, options) {
  return request(endpoint, { ...options, method: "PATCH", body });
}

export function del(endpoint, options) {
  return request(endpoint, { ...options, method: "DELETE" });
}

export { BASE_URL };
