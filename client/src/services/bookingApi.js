import { del, get, post } from "./api.js";

export async function fetchMyBookings() {
  const response = await get("/bookings/my");
  return Array.isArray(response?.data) ? response.data : [];
}

export async function createBooking(classId) {
  const response = await post("/bookings", { classId: Number(classId) });
  return response?.data ?? null;
}

export async function cancelBooking(id) {
  const response = await del(`/bookings/${id}`);
  return response?.data ?? null;
}
