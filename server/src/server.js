import http from "http";
import app from "./app.js";
import { PORT } from "./config/env.js";

const server = http.createServer(app);

const port = Number(PORT) || 4000;
server.listen(port, () => {
  console.log(`Server listening on http://localhost:${port}`);
});

// Graceful shutdown
process.on("SIGINT", () => {
  console.log("Shutting down");
  process.exit(0);
});
