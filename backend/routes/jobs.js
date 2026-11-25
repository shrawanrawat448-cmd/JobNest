import express from "express";
import Job from "../models/Job.js";
import Application from "../models/Application.js";
import { protect, roleOnly } from "../middleware/auth.js";
const router = express.Router();
router.get("/", async (req, res) => {
  try {
    const { search, location, type, category } = req.query;
    const filter = {};
    if (search?.trim())
      filter.$or = [
        { title: { $regex: search.trim(), $options: "i" } },
        { company: { $regex: search.trim(), $options: "i" } },
        { skills: { $regex: search.trim(), $options: "i" } },
        { description: { $regex: search.trim(), $options: "i" } },
      ];
    if (location?.trim())
      filter.location = { $regex: location.trim(), $options: "i" };
    if (type && type !== "All types") filter.jobType = type;
    if (category && category !== "All categories") filter.category = category;
    const jobs = await Job.find(filter)
      .populate("postedBy", "name company")
      .sort({ createdAt: -1 })
      .limit(100);
    res.json({ jobs });
  } catch {
    res.status(500).json({ message: "Could not load jobs." });
  }
});
router.get(
  "/employer/mine",
  protect,
  roleOnly("employer"),
  async (req, res) => {
    try {
      const jobs = await Job.find({ postedBy: req.user._id }).sort({
        createdAt: -1,
      });

      res.json({ jobs });
    } catch (error) {
      res.status(500).json({ message: "Could not load your jobs." });
    }
  },
);
router.get("/:id", async (req, res) => {
  try {
    const job = await Job.findById(req.params.id).populate(
      "postedBy",
      "name company",
    );
    if (!job) return res.status(404).json({ message: "Job not found." });
    res.json({ job });
  } catch {
    res.status(400).json({ message: "Invalid job ID." });
  }
});
router.post("/", protect, roleOnly("employer"), async (req, res) => {
  try {
    const {
      title,
      company,
      location,
      salary,
      jobType,
      category,
      description,
      skills,
    } = req.body;
    if (!title || !company || !location || !description)
      return res
        .status(400)
        .json({
          message: "Title, company, location and description are required.",
        });
    const job = await Job.create({
      title,
      company,
      location,
      salary,
      jobType,
      category,
      description,
      skills: Array.isArray(skills)
        ? skills
        : String(skills || "")
            .split(",")
            .map((s) => s.trim())
            .filter(Boolean),
      postedBy: req.user._id,
    });
    res.status(201).json({ job });
  } catch {
    res.status(500).json({ message: "Could not publish job." });
  }
});

router.put("/:id", protect, roleOnly("employer"), async (req, res) => {
  try {
    const allowedFields = [
      "title",
      "company",
      "location",
      "salary",
      "jobType",
      "category",
      "description",
      "skills",
    ];

    const updates = {};

    for (const field of allowedFields) {
      if (req.body[field] !== undefined) {
        updates[field] = req.body[field];
      }
    }

    if (updates.skills !== undefined) {
      updates.skills = Array.isArray(updates.skills)
        ? updates.skills
        : String(updates.skills)
            .split(",")
            .map((skill) => skill.trim())
            .filter(Boolean);
    }

    const job = await Job.findOneAndUpdate(
      { _id: req.params.id, postedBy: req.user._id },
      updates,
      { new: true, runValidators: true },
    );

    if (!job) {
      return res.status(404).json({
        message: "Job not found or you do not own it.",
      });
    }

    res.json({ job });
  } catch {
    res.status(400).json({
      message: "Could not update job.",
    });
  }
});
export default router;
