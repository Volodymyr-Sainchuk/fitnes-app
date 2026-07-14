import express from "express";
import cors from "cors";
import helmet from "helmet";
import authRoutes from "./routes/authRoutes.js";
import userRoutes from "./routes/userRoutes.js";
import classRoutes from "./routes/classRoutes.js";
import bookingRoutes from "./routes/bookingRoutes.js";
import trainerRoutes from "./routes/trainerRoutes.js";
import membershipRoutes from "./routes/membershipRoutes.js";
import paymentRoutes from "./routes/paymentRoutes.js";
import adminAnalyticsRoutes from "./routes/adminAnalyticsRoutes.js";
import errorMiddleware from "./middleware/errorMiddleware.js";
import { CLIENT_URL, NODE_ENV } from "./config/env.js";

const app = express();

const DEVELOPMENT_ORIGIN = "http://localhost:5173";

const normalizeOrigin = (origin) => origin.replace(/\/$/, "");

const allowedOrigins = new Set();
if (CLIENT_URL) {
  allowedOrigins.add(normalizeOrigin(CLIENT_URL));
}

if (NODE_ENV !== "production") {
  allowedOrigins.add(DEVELOPMENT_ORIGIN);
}

const corsOptions = {
  origin(origin, callback) {
    // Allow server-to-server and health-check requests with no Origin header.
    if (!origin) {
      callback(null, true);
      return;
    }

    const normalizedOrigin = normalizeOrigin(origin);
    if (allowedOrigins.has(normalizedOrigin)) {
      callback(null, true);
      return;
    }

    const corsError = new Error("CORS origin not allowed");
    corsError.status = 403;
    callback(corsError);
  },
  credentials: true,
  methods: ["GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS"],
  allowedHeaders: ["Content-Type", "Authorization"],
};

app.use(helmet());
app.use(cors(corsOptions));
app.options(/.*/, cors(corsOptions));
app.use(express.json());

app.use("/api/auth", authRoutes);
app.use("/api/users", userRoutes);
app.use("/api/classes", classRoutes);
app.use("/api/bookings", bookingRoutes);
app.use("/api/trainers", trainerRoutes);
app.use("/api/memberships", membershipRoutes);
app.use("/api/payments", paymentRoutes);
app.use("/api/admin/analytics", adminAnalyticsRoutes);

app.use((req, res) => {
  res.status(404).json({ success: false, message: `Route not found: ${req.method} ${req.originalUrl}` });
});

// Global error handler
app.use(errorMiddleware);

export default app;
