import { post } from "./api.js";

export async function loginUser(credentials) {
  const response = await post("/auth/login", credentials);
  return response?.data ?? null;
}

export async function registerUser(payload) {
  const response = await post("/auth/register", payload);
  return response?.data ?? null;
}
