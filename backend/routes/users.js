import express from "express";
import multer from "multer";
import path from "path";
import fs from "fs";
import User from "../models/User.js";
import { protect, roleOnly } from "../middleware/auth.js";
const router = express.Router();
const uploadDir = path.resolve("uploads");
fs.mkdirSync(uploadDir, { recursive: true });
const storage = multer.diskStorage({
  destination: (_r, _f, cb) => cb(null, uploadDir),
  filename: (_r, f, cb) =>
    cb(
      null,
      `${Date.now()}-${Math.round(Math.random() * 1e8)}${path.extname(f.originalname).toLowerCase()}`,
    ),
});
const upload = multer({
  storage,
  limits: { fileSize: 5 * 1024 * 1024 },
  fileFilter: (_r, f, cb) => {
    const ok = [
      "application/pdf",
      "application/msword",
      "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
    ].includes(f.mimetype);
    cb(ok ? null : new Error("Resume must be PDF, DOC, or DOCX."), ok);
  },
});
const validateResumeSignature = async (req, res, next) => {
  if (!req.file) return next();

  try {
    const { fileTypeFromFile } = await import("file-type");
    const detected = await fileTypeFromFile(req.file.path);

    const allowedTypes = [
      "application/pdf",
      "application/msword",
      "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
    ];

    if (!detected || !allowedTypes.includes(detected.mime)) {
      await fs.promises.unlink(req.file.path).catch(() => {});
      return res.status(400).json({
        message: "Invalid resume file. Only PDF, DOC and DOCX are allowed.",
      });
    }

    next();
  } catch (error) {
    await fs.promises.unlink(req.file.path).catch(() => {});
    return res.status(400).json({
      message: "Could not validate resume file.",
    });
  }
};
router.put("/profile", protect, async (req, res) => {
  try {
    const allowedFields = ["name", "location", "bio", "skills"];

    const updates = {};

    for (const field of allowedFields) {
      if (req.body[field] !== undefined) {
        updates[field] = req.body[field];
      }
    }

    if (req.user.role === "employer" && req.body.company !== undefined) {
      updates.company = req.body.company;
    }

    if (updates.skills !== undefined) {
      updates.skills = Array.isArray(updates.skills)
        ? updates.skills
        : String(updates.skills)
            .split(",")
            .map((skill) => skill.trim())
            .filter(Boolean);
    }

    const user = await User.findByIdAndUpdate(req.user._id, updates, {
      new: true,
      runValidators: true,
    }).select("-password");

    res.json({ user });
  } catch {
    res.status(400).json({
      message: "Could not update profile.",
    });
  }
});

router.post(
  "/resume",
  protect,
  roleOnly("candidate"),
  upload.single("resume"),
  validateResumeSignature,
  async (req, res) => {
    if (!req.file)
      return res.status(400).json({ message: "Please choose a resume file." });
    const resume = `/uploads/${req.file.filename}`;
    const user = await User.findByIdAndUpdate(
      req.user._id,
      { resume },
      { new: true },
    ).select("-password");
    res.json({ user, message: "Resume uploaded successfully." });
  },
);
export default router;
