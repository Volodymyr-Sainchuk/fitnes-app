import prisma from "../config/db.js";
import { createUser as createUserRecord } from "../services/authService.js";
import { createUserSchema, updateUserSchema } from "../validators/authValidator.js";

const validRoles = ["MEMBER", "TRAINER", "ADMIN"];

function normalizeSocialLinks(value) {
  if (!value) return null;
  if (typeof value !== "object" || Array.isArray(value)) return null;
  const normalized = {};
  for (const [key, url] of Object.entries(value)) {
    if (typeof url === "string" && url.trim()) normalized[key] = url.trim();
  }
  return Object.keys(normalized).length ? normalized : null;
}

export async function getMe(req, res, next) {
  try {
    const user = await prisma.user.findUnique({
      where: { id: req.user.id },
      select: {
        id: true,
        name: true,
        email: true,
        phone: true,
        role: true,
        createdAt: true,
        socialLinks: true,
      },
    });
    res.json({ success: true, data: user });
  } catch (err) {
    next(err);
  }
}

export async function updateMe(req, res, next) {
  try {
    const data = {};
    if (req.body.name !== undefined) data.name = req.body.name;
    if (req.body.email !== undefined) {
      const existing = await prisma.user.findFirst({ where: { email: req.body.email, NOT: { id: req.user.id } } });
      if (existing) return res.status(409).json({ success: false, message: "Email already in use" });
      data.email = req.body.email;
    }
    if (req.body.phone !== undefined) data.phone = req.body.phone || null;
    if (req.body.socialLinks !== undefined) data.socialLinks = normalizeSocialLinks(req.body.socialLinks);
    const user = await prisma.user.update({
      where: { id: req.user.id },
      data,
      select: {
        id: true,
        name: true,
        email: true,
        phone: true,
        role: true,
        socialLinks: true,
      },
    });
    res.json({ success: true, data: user });
  } catch (err) {
    next(err);
  }
}

export async function listUsers(req, res, next) {
  try {
    const page = Number(req.query.page) || 1;
    const limit = Number(req.query.limit) || 10;
    const skip = (page - 1) * limit;
    const [users, total] = await Promise.all([
      prisma.user.findMany({
        skip,
        take: limit,
        orderBy: { createdAt: "desc" },
        select: {
          id: true,
          name: true,
          email: true,
          role: true,
          createdAt: true,
          phone: true,
          socialLinks: true,
        },
      }),
      prisma.user.count(),
    ]);

    res.json({
      success: true,
      data: {
        users,
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit),
      },
    });
  } catch (err) {
    next(err);
  }
}

export async function createUser(req, res, next) {
  try {
    const validation = createUserSchema.validate(req.body);
    if (validation.error) return res.status(400).json({ success: false, message: validation.error.message });

    const existing = await prisma.user.findUnique({ where: { email: req.body.email } });
    if (existing) return res.status(409).json({ success: false, message: "Email already in use" });

    const user = await createUserRecord({
      name: req.body.name,
      email: req.body.email,
      password: req.body.password,
      role: req.body.role || "MEMBER",
      phone: req.body.phone || null,
      socialLinks: normalizeSocialLinks(req.body.socialLinks),
    });

    res.status(201).json({
      success: true,
      data: {
        id: user.id,
        name: user.name,
        email: user.email,
        role: user.role,
        phone: user.phone,
        socialLinks: user.socialLinks,
        createdAt: user.createdAt,
      },
    });
  } catch (err) {
    next(err);
  }
}

export async function updateUser(req, res, next) {
  try {
    const id = Number(req.params.id);
    const validation = updateUserSchema.validate(req.body);
    if (validation.error) return res.status(400).json({ success: false, message: validation.error.message });

    const data = {};
    if (req.body.name !== undefined) data.name = req.body.name;
    if (req.body.email !== undefined) {
      const existing = await prisma.user.findFirst({ where: { email: req.body.email, NOT: { id } } });
      if (existing) return res.status(409).json({ success: false, message: "Email already in use" });
      data.email = req.body.email;
    }
    if (req.body.password) {
      const bcrypt = (await import("bcryptjs")).default;
      data.passwordHash = await bcrypt.hash(req.body.password, 10);
    }
    if (req.body.role !== undefined) data.role = req.body.role;
    if (req.body.phone !== undefined) data.phone = req.body.phone || null;
    if (req.body.socialLinks !== undefined) data.socialLinks = normalizeSocialLinks(req.body.socialLinks);

    const user = await prisma.user.update({
      where: { id },
      data,
      select: {
        id: true,
        name: true,
        email: true,
        role: true,
        createdAt: true,
        phone: true,
        socialLinks: true,
      },
    });

    res.json({ success: true, data: user });
  } catch (err) {
    next(err);
  }
}

export async function updateUserRole(req, res, next) {
  try {
    const id = Number(req.params.id);
    const role = req.body.role;

    if (!validRoles.includes(role)) {
      return res.status(400).json({ success: false, message: "Invalid role" });
    }

    const user = await prisma.user.update({
      where: { id },
      data: { role },
      select: {
        id: true,
        name: true,
        email: true,
        role: true,
        createdAt: true,
        phone: true,
        socialLinks: true,
      },
    });

    res.json({ success: true, data: user });
  } catch (err) {
    next(err);
  }
}
