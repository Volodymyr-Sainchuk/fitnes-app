import { get, patch, post } from "./api.js";

export async function fetchCurrentUser() {
  const response = await get("/users/me");
  return response?.data ?? null;
}

export async function updateCurrentUser(payload) {
  const response = await patch("/users/me", payload);
  return response?.data ?? response ?? null;
}

export async function fetchUsers(page = 1, limit = 10) {
  const response = await get(`/users?page=${page}&limit=${limit}`);
  return response?.data ?? { users: [], page, limit, total: 0, totalPages: 1 };
}

export async function createUser(payload) {
  const response = await post("/users", payload);
  return response?.data ?? null;
}

export async function updateUserRole(id, role) {
  const response = await patch(`/users/${id}/role`, { role });
  return response?.data ?? null;
}
