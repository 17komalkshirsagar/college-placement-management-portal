import { Schema, model } from 'mongoose';

const studentProfileSchema = new Schema(
  {
    user: { type: Schema.Types.ObjectId, ref: 'User', required: true, unique: true },
    mobileNumber: { type: String, required: true, trim: true },
    course: { type: String, required: true, trim: true },
    branch: { type: String, required: true, trim: true },
    year: { type: Number, required: true, min: 1, max: 6 },
    skills: [{ type: String, trim: true }],
    resumeUrl: { type: String, trim: true, default: null },
    resumeFileName: { type: String, trim: true, default: null },
    resumeUpdatedAt: { type: Date, default: null },
  },
  { timestamps: true }
);

const StudentProfile = model('StudentProfile', studentProfileSchema);

export default StudentProfile;
