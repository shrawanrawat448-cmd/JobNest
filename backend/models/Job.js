import mongoose from 'mongoose';
const jobSchema = new mongoose.Schema({
  title: { type: String, required: true, trim: true, maxlength: 120 },
  company: { type: String, required: true, trim: true, maxlength: 120 },
  location: { type: String, required: true, trim: true },
  salary: { type: String, default: 'Not disclosed' },
  jobType: { type: String, enum: ['Full Time', 'Part Time', 'Contract', 'Internship'], default: 'Full Time' },
  category: { type: String, default: 'Technology' },
  description: { type: String, required: true, maxlength: 10000 },
  skills: { type: [String], default: [] },
  postedBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true }
}, { timestamps: true });
jobSchema.index({ title: 'text', company: 'text', location: 'text', category: 'text', description: 'text' });
export default mongoose.model('Job', jobSchema);
