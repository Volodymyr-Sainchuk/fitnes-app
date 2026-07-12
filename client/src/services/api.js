const BASE_URL = import.meta.env.VITE_API_URL || "http://localhost:5000/api";

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

  const response = await fetch(`${BASE_URL}${endpoint}`, config);

  let payload = null;
  try {
    payload = await response.json();
  } catch {
    payload = null;
  }

  if (!response.ok) {
    throw new Error(payload?.message || payload?.error || "Сталася помилка запиту");
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
