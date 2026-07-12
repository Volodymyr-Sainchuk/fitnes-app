import prisma from "../config/db.js";

function normalizeSocialLinks(value) {
  if (!value) return null;
  if (typeof value !== "object" || Array.isArray(value)) return null;
  const normalized = {};
  for (const [key, url] of Object.entries(value)) {
    if (typeof url === "string" && url.trim()) normalized[key] = url.trim();
  }
  return Object.keys(normalized).length ? normalized : null;
}

const userSelect = {
  id: true,
  name: true,
  role: true,
  phone: true,
  socialLinks: true,
};

export async function list(req, res, next) {
  try {
    const list = await prisma.trainer.findMany({
      include: {
        user: { select: userSelect },
        classes: true,
      },
    });
    res.json({ success: true, data: list });
  } catch (err) {
    next(err);
  }
}

export async function getById(req, res, next) {
  try {
    const id = Number(req.params.id);
    const item = await prisma.trainer.findUnique({
      where: { id },
      include: {
        user: { select: userSelect },
        classes: true,
      },
    });
    if (!item) return res.status(404).json({ success: false, message: "Not found" });
    res.json({ success: true, data: item });
  } catch (err) {
    next(err);
  }
}

export async function create(req, res, next) {
  try {
    const { userId, photo, bio, specialization, phone, socialLinks } = req.body;
    const trainer = await prisma.$transaction(async (tx) => {
      if (phone !== undefined || socialLinks !== undefined) {
        await tx.user.update({
          where: { id: Number(userId) },
          data: {
            ...(phone !== undefined ? { phone: phone || null } : {}),
            ...(socialLinks !== undefined ? { socialLinks: normalizeSocialLinks(socialLinks) } : {}),
          },
        });
      }
      return tx.trainer.create({
        data: { userId: Number(userId), photo, bio, specialization },
        include: { user: { select: userSelect }, classes: true },
      });
    });
    res.status(201).json({ success: true, data: trainer });
  } catch (err) {
    next(err);
  }
}

export async function update(req, res, next) {
  try {
    const id = Number(req.params.id);
    const { phone, socialLinks, ...trainerData } = req.body;
    const updated = await prisma.$transaction(async (tx) => {
      if (phone !== undefined || socialLinks !== undefined) {
        const trainer = await tx.trainer.findUnique({ where: { id } });
        if (trainer) {
          await tx.user.update({
            where: { id: trainer.userId },
            data: {
              ...(phone !== undefined ? { phone: phone || null } : {}),
              ...(socialLinks !== undefined ? { socialLinks: normalizeSocialLinks(socialLinks) } : {}),
            },
          });
        }
      }
      return tx.trainer.update({
        where: { id },
        data: trainerData,
        include: { user: { select: userSelect }, classes: true },
      });
    });
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
