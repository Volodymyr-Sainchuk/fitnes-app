import { del, get, patch, post } from "./api.js";

export async function fetchClasses() {
  const response = await get("/classes");
  return Array.isArray(response?.data) ? response.data : [];
}

export async function createClass(payload) {
  const response = await post("/classes", payload);
  return response?.data ?? null;
}

export async function updateClass(id, payload) {
  const response = await patch(`/classes/${id}`, payload);
  return response?.data ?? null;
}

export async function deleteClass(id) {
  const response = await del(`/classes/${id}`);
  return response?.data ?? null;
}
