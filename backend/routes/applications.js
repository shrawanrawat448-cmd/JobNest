import express from "express";
import multer from "multer";
import path from "path";
import fs from "fs";
import Application from "../models/Application.js";
import Job from "../models/Job.js";
import { protect, roleOnly } from "../middleware/auth.js";
import { sendMail } from "../utils/mail.js";
const router = express.Router();
const uploadDir = path.resolve("uploads");
fs.mkdirSync(uploadDir, { recursive: true });
const storage = multer.diskStorage({
  destination: (_req, _file, cb) => cb(null, uploadDir),
  filename: (_req, file, cb) =>
    cb(
      null,
      `${Date.now()}-${Math.round(Math.random() * 1e8)}${path.extname(file.originalname).toLowerCase()}`,
    ),
});
const upload = multer({
  storage,
  limits: { fileSize: 5 * 1024 * 1024 },
  fileFilter: (_req, file, cb) => {
    const allowed = [
      "application/pdf",
      "application/msword",
      "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
    ];
    cb(
      allowed.includes(file.mimetype)
        ? null
        : new Error("Resume must be PDF, DOC, or DOCX."),
      allowed.includes(file.mimetype),
    );
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
router.post(
  "/:jobId",
  protect,
  roleOnly("candidate"),
  upload.single("resume"),
  validateResumeSignature,
  async (req, res) => {
    try {
      if (!req.file && !req.user.resume)
        return res
          .status(400)
          .json({ message: "Please upload a resume before applying." });
      const job = await Job.findById(req.params.jobId).populate(
        "postedBy",
        "email name company",
      );
      if (!job) return res.status(404).json({ message: "Job not found." });
      const resumePath = req.file
        ? `/uploads/${req.file.filename}`
        : req.user.resume;
      const application = await Application.create({
        job: job._id,
        candidate: req.user._id,
        resume: resumePath,
        coverLetter: req.body.coverLetter || "",
      });
      await sendMail(
        req.user.email,
        "Application submitted successfully",
        `Your application for ${job.title} at ${job.company} was submitted successfully.`,
      );
      if (job.postedBy?.email)
        await sendMail(
          job.postedBy.email,
          "New job application received",
          `${req.user.name} applied for ${job.title}. Log in to JobNest to review the application.`,
        );
      res
        .status(201)
        .json({ message: "Application submitted successfully!", application });
    } catch (e) {
      if (e.code === 11000)
        return res
          .status(409)
          .json({ message: "You have already applied for this job." });
      res.status(500).json({
        message: e.message?.includes("Resume")
          ? e.message
          : "Could not submit application.",
      });
    }
  },
);
router.get("/my", protect, roleOnly("candidate"), async (req, res) => {
  try {
    const applications = await Application.find({ candidate: req.user._id })
      .populate("job")
      .sort({ createdAt: -1 });
    res.json({ applications });
  } catch {
    res.status(500).json({ message: "Could not load your applications." });
  }
});
router.get("/job/:jobId", protect, roleOnly("employer"), async (req, res) => {
  try {
    const job = await Job.findOne({
      _id: req.params.jobId,
      postedBy: req.user._id,
    });
    if (!job)
      return res.status(404).json({ message: "Job not found or not yours." });
    const applications = await Application.find({ job: job._id })
      .populate("candidate", "name email location skills bio")
      .sort({ createdAt: -1 });
    res.json({ applications });
  } catch {
    res.status(400).json({ message: "Could not load applicants." });
  }
});
router.patch("/:id/status", protect, roleOnly("employer"), async (req, res) => {
  try {
    const { status } = req.body;
    if (!["Applied", "Shortlisted", "Rejected", "Hired"].includes(status))
      return res.status(400).json({ message: "Invalid status." });
    const application = await Application.findById(req.params.id)
      .populate("job")
      .populate("candidate", "email name");
    if (
      !application ||
      String(application.job.postedBy) !== String(req.user._id)
    )
      return res.status(404).json({ message: "Application not found." });
    application.status = status;
    await application.save();
    await sendMail(
      application.candidate.email,
      "Application status update",
      `Your application for ${application.job.title} has been updated to: ${status}.`,
    );
    res.json({ application });
  } catch {
    res.status(500).json({ message: "Could not update application." });
  }
});

router.get("/:id/resume", protect, roleOnly("employer"), async (req, res) => {
  try {
    const application = await Application.findById(req.params.id).populate(
      "job",
    );

    if (!application || !application.job) {
      return res.status(404).json({ message: "Application not found." });
    }

    if (String(application.job.postedBy) !== String(req.user._id)) {
      return res.status(403).json({ message: "Access denied." });
    }

    const filename = path.basename(application.resume);
    const filePath = path.resolve("uploads", filename);

    res.sendFile(filePath, (err) => {
      if (err && !res.headersSent) {
        res.status(404).json({ message: "Resume file not found." });
      }
    });
  } catch {
    res.status(500).json({ message: "Could not open resume." });
  }
});
export default router;
