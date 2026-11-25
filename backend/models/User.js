import mongoose from 'mongoose';
const userSchema = new mongoose.Schema({
  name: { type: String, required: true, trim: true, maxlength: 80 },
  email: { type: String, required: true, unique: true, lowercase: true, trim: true },
  password: { type: String, required: true },
  role: { type: String, enum: ['candidate', 'employer'], required: true },
  location: { type: String, default: '' },
  skills: { type: [String], default: [] },
  bio: { type: String, default: '', maxlength: 1200 },
  resume: { type: String, default: '' },
  company: { type: String, default: '' }
}, { timestamps: true });
export default mongoose.model('User', userSchema);
