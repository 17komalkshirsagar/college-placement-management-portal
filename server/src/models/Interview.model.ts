import { Schema, model } from 'mongoose';

const interviewSchema = new Schema(
  {
    application: { type: Schema.Types.ObjectId, ref: 'Application', required: true },
    scheduledAt: { type: Date, required: true },
    mode: { type: String, enum: ['online', 'offline'], required: true },
    round: { type: String, required: true },
    status: { type: String, enum: ['scheduled', 'completed', 'cancelled'], default: 'scheduled' },
    feedback: { type: String, trim: true },
    result: { type: String, enum: ['pending', 'passed', 'failed'], default: 'pending' },
  },
  { timestamps: true }
);

const Interview = model('Interview', interviewSchema);

export default Interview;
