import prisma from "../config/db.js";

export async function countActiveBookingsForClass(classId) {
  return prisma.booking.count({ where: { classId, status: "ACTIVE" } });
}

export async function createBooking(userId, classId) {
  return prisma.booking.create({ data: { userId, classId } });
}
