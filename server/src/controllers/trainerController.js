import prisma from "../config/db.js";

export async function list(req, res, next) {
  try {
    const list = await prisma.trainer.findMany({ include: { user: true, classes: true } });
    res.json({ success: true, data: list });
  } catch (err) {
    next(err);
  }
}

export async function getById(req, res, next) {
  try {
    const id = Number(req.params.id);
    const item = await prisma.trainer.findUnique({ where: { id }, include: { user: true, classes: true } });
    if (!item) return res.status(404).json({ success: false, message: "Not found" });
    res.json({ success: true, data: item });
  } catch (err) {
    next(err);
  }
}

export async function create(req, res, next) {
  try {
    const { userId, photo, bio, specialization } = req.body;
    const created = await prisma.trainer.create({ data: { userId, photo, bio, specialization } });
    res.status(201).json({ success: true, data: created });
  } catch (err) {
    next(err);
  }
}

export async function update(req, res, next) {
  try {
    const id = Number(req.params.id);
    const updated = await prisma.trainer.update({ where: { id }, data: req.body });
    res.json({ success: true, data: updated });
  } catch (err) {
    next(err);
  }
}

export async function remove(req, res, next) {
  try {
    const id = Number(req.params.id);
    await prisma.trainer.delete({ where: { id } });
    res.json({ success: true, data: null });
  } catch (err) {
    next(err);
  }
}
