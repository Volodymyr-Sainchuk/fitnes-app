import prisma from "../config/db.js";
import bcrypt from "bcryptjs";

export async function createUser({ name, email, password }) {
  const passwordHash = await bcrypt.hash(password, 10);
  return prisma.user.create({ data: { name, email, passwordHash } });
}

export async function findByEmail(email) {
  return prisma.user.findUnique({ where: { email } });
}
