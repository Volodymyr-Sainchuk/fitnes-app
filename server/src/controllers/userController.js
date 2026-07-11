import prisma from "../config/db.js";

export async function getMe(req, res, next) {
  try {
    const user = await prisma.user.findUnique({
      where: { id: req.user.id },
      select: { id: true, name: true, email: true, phone: true, role: true, createdAt: true },
    });
    res.json({ success: true, data: user });
  } catch (err) {
    next(err);
  }
}

export async function updateMe(req, res, next) {
  try {
    const data = {};
    if (req.body.name) data.name = req.body.name;
    if (req.body.phone) data.phone = req.body.phone;
    const user = await prisma.user.update({
      where: { id: req.user.id },
      data,
      select: { id: true, name: true, email: true, phone: true, role: true },
    });
    res.json({ success: true, data: user });
  } catch (err) {
    next(err);
  }
}
