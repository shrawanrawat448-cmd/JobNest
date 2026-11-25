import express from "express";
import mongoose from "mongoose";
import cors from "cors";
import dotenv from "dotenv";
import path from "path";
import helmet from "helmet";
import rateLimit from "express-rate-limit";
import authRoutes from "./routes/auth.js";
import jobRoutes from "./routes/jobs.js";
import applicationRoutes from "./routes/applications.js";
import userRoutes from "./routes/users.js";
dotenv.config();
const app = express();
app.use(helmet());
const allowedOrigins = process.env.CLIENT_URL
  ? process.env.CLIENT_URL.split(",").map((origin) => origin.trim())
  : ["http://localhost:5173"];

app.use(
  cors({
    origin: allowedOrigins,
    methods: ["GET", "POST", "PUT", "PATCH", "DELETE"],
    allowedHeaders: ["Content-Type", "Authorization"],
  }),
);
app.use(express.json({ limit: "1mb" }));
app.use(
  "/api/auth",
  rateLimit({
    windowMs: 15 * 60 * 1000,
    max: 100,
    standardHeaders: true,
    legacyHeaders: false,
  }),
  authRoutes,
);
app.use("/api/jobs", jobRoutes);
app.use("/api/applications", applicationRoutes);
app.use("/api/users", userRoutes);
app.get("/api/health", (_req, res) =>
  res.json({ status: "ok", service: "JobNest API" }),
);
app.use((err, _req, res, _next) => {
  console.error(err.message);
  res
    .status(err instanceof SyntaxError ? 400 : 500)
    .json({ message: err.message || "Something went wrong." });
});
const PORT = process.env.PORT || 5000;
if (!process.env.JWT_SECRET)
  console.error("Missing JWT_SECRET. Set it in backend/.env");
if (!process.env.MONGODB_URI)
  console.error("Missing MONGODB_URI. Set it in backend/.env");
mongoose
  .connect(process.env.MONGODB_URI)
  .then(() => {
    console.log("MongoDB connected");
    app.listen(PORT, () => console.log(`JobNest API listening on ${PORT}`));
  })
  .catch((err) => {
    console.error("MongoDB connection failed:", err.message);
    process.exit(1);
  });
