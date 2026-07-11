import prisma from "../config/db.js";

export async function list(req, res, next) {
  try {
    const items = await prisma.membership.findMany();
    res.json({ success: true, data: items });
  } catch (err) {
    next(err);
  }
}

export async function getById(req, res, next) {
  try {
    const id = Number(req.params.id);
    const item = await prisma.membership.findUnique({ where: { id } });
    if (!item) return res.status(404).json({ success: false, message: "Not found" });
    res.json({ success: true, data: item });
  } catch (err) {
    next(err);
  }
}

export async function create(req, res, next) {
  try {
    const created = await prisma.membership.create({ data: req.body });
    res.status(201).json({ success: true, data: created });
  } catch (err) {
    next(err);
  }
}

export async function update(req, res, next) {
  try {
    const id = Number(req.params.id);
    const updated = await prisma.membership.update({ where: { id }, data: req.body });
    res.json({ success: true, data: updated });
  } catch (err) {
    next(err);
  }
}

export async function remove(req, res, next) {
  try {
    const id = Number(req.params.id);
    await prisma.membership.delete({ where: { id } });
    res.json({ success: true, data: null });
  } catch (err) {
    next(err);
  }
}
