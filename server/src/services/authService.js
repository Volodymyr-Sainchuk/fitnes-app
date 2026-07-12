import prisma from "../config/db.js";
import bcrypt from "bcryptjs";

export async function createUser({ name, email, password, role = "MEMBER", phone = null, socialLinks = null }) {
  const passwordHash = await bcrypt.hash(password, 10);
  return prisma.user.create({
    data: {
      name,
      email,
      passwordHash,
      role,
      phone,
      socialLinks,
    },
  });
}

export async function findByEmail(email) {
  return prisma.user.findUnique({ where: { email } });
}
