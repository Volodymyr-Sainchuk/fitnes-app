import { del, get, patch, post } from "./api.js";

export async function fetchMemberships() {
  const response = await get("/memberships");
  return Array.isArray(response?.data) ? response.data : [];
}

export async function createMembership(payload) {
  const response = await post("/memberships", payload);
  return response?.data ?? null;
}

export async function updateMembership(id, payload) {
  const response = await patch(`/memberships/${id}`, payload);
  return response?.data ?? null;
}

export async function deleteMembership(id) {
  const response = await del(`/memberships/${id}`);
  return response?.data ?? null;
}
