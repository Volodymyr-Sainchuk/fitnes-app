import prisma from "../config/db.js";

export async function create(req, res, next) {
  try {
    const userId = req.user.id;
    const { classId } = req.body;
    const cls = await prisma.fitnessClass.findUnique({ where: { id: classId }, include: { bookings: true } });
    if (!cls) return res.status(404).json({ success: false, message: "Class not found" });
    if (new Date(cls.dateTime) < new Date())
      return res.status(400).json({ success: false, message: "Cannot book past class" });
    if (cls.bookings.length >= cls.capacity) return res.status(400).json({ success: false, message: "Class is full" });
    const existing = await prisma.booking.findFirst({ where: { userId, classId, status: "ACTIVE" } });
    if (existing)
      return res.status(400).json({ success: false, message: "You already have an active booking for this class" });
    const booking = await prisma.booking.create({ data: { userId, classId } });
    res.status(201).json({ success: true, data: booking });
  } catch (err) {
    next(err);
  }
}

export async function myBookings(req, res, next) {
  try {
    const userId = req.user.id;
    const bookings = await prisma.booking.findMany({ where: { userId }, include: { fitness: true } });
    res.json({ success: true, data: bookings });
  } catch (err) {
    next(err);
  }
}

export async function remove(req, res, next) {
  try {
    const id = Number(req.params.id);
    const booking = await prisma.booking.findUnique({ where: { id } });
    if (!booking) return res.status(404).json({ success: false, message: "Not found" });
    if (booking.userId !== req.user.id) return res.status(403).json({ success: false, message: "Forbidden" });
    await prisma.booking.delete({ where: { id } });
    res.json({ success: true, data: null });
  } catch (err) {
    next(err);
  }
}
