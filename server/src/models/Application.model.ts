import { Schema, model } from 'mongoose';

const applicationSchema = new Schema(
  {
    student: { type: Schema.Types.ObjectId, ref: 'StudentProfile', required: true },
    job: { type: Schema.Types.ObjectId, ref: 'Job', required: true },
    status: {
      type: String,
      enum: ['applied', 'shortlisted', 'rejected', 'selected'],
      default: 'applied',
    },
    resumeUrl: { type: String, required: true, trim: true },
    coverLetter: { type: String, trim: true },
    decisionHistory: [
      {
        status: { type: String, enum: ['applied', 'shortlisted', 'rejected', 'selected'], required: true },
        updatedAt: { type: Date, default: Date.now },
      },
    ],
  },
  { timestamps: true }
);

applicationSchema.index({ student: 1, job: 1 }, { unique: true });

const Application = model('Application', applicationSchema);

export default Application;
