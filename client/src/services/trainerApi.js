import { del, get, patch, post } from "./api.js";

export async function fetchTrainers() {
  const response = await get("/trainers");
  return Array.isArray(response?.data) ? response.data : [];
}

export async function createTrainer(payload) {
  const response = await post("/trainers", payload);
  return response?.data ?? null;
}

export async function updateTrainer(id, payload) {
  const response = await patch(`/trainers/${id}`, payload);
  return response?.data ?? null;
}

export async function deleteTrainer(id) {
  const response = await del(`/trainers/${id}`);
  return response?.data ?? null;
}
