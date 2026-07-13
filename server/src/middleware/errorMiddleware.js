export default function errorMiddleware(err, req, res, next) {
  console.error(`[${req?.method || "?"} ${req?.originalUrl || "?"}]`, err);
  const status = err.status || 500;
  res.status(status).json({ success: false, message: err.message || "Server error" });
}
