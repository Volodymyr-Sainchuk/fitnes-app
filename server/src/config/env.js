import dotenv from "dotenv";
import path from "path";

const envPath = path.resolve(process.cwd(), ".env");
dotenv.config({ path: envPath });

export const PORT = process.env.PORT || 4000;
export const DATABASE_URL = process.env.DATABASE_URL;
export const JWT_SECRET = process.env.JWT_SECRET || "change_me";
export const JWT_EXPIRES_IN = process.env.JWT_EXPIRES_IN || "7d";
export const CLIENT_URL = process.env.CLIENT_URL || "http://localhost:5173";
