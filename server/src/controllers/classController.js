import prisma from "../config/db.js";

export async function list(req, res, next) {
  try {
    const classes = await prisma.fitnessClass.findMany({
      include: { trainer: { include: { user: true } }, bookings: true },
    });
    res.json({ success: true, data: classes });
  } catch (err) {
    next(err);
  }
}

export async function getById(req, res, next) {
  try {
    const id = Number(req.params.id);
    const item = await prisma.fitnessClass.findUnique({
      where: { id },
      include: { trainer: { include: { user: true } }, bookings: true },
    });
    if (!item) return res.status(404).json({ success: false, message: "Not found" });
    res.json({ success: true, data: item });
  } catch (err) {
    next(err);
  }
}

export async function create(req, res, next) {
  try {
    const data = req.body;
    const created = await prisma.fitnessClass.create({ data });
    res.status(201).json({ success: true, data: created });
  } catch (err) {
    next(err);
  }
}

export async function update(req, res, next) {
  try {
    const id = Number(req.params.id);
    const updated = await prisma.fitnessClass.update({ where: { id }, data: req.body });
    res.json({ success: true, data: updated });
  } catch (err) {
    next(err);
  }
}

export async function remove(req, res, next) {
  try {
    const id = Number(req.params.id);
    await prisma.fitnessClass.delete({ where: { id } });
    res.json({ success: true, data: null });
  } catch (err) {
    next(err);
  }
}
