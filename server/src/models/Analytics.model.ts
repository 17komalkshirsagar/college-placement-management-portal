import { Schema, model } from 'mongoose';

const analyticsSchema = new Schema(
  {
    year: { type: Number, required: true, unique: true },
    totalStudents: { type: Number, default: 0 },
    totalCompanies: { type: Number, default: 0 },
    totalJobs: { type: Number, default: 0 },
    totalApplications: { type: Number, default: 0 },
    totalInterviews: { type: Number, default: 0 },
    totalOffers: { type: Number, default: 0 },
    placementRate: { type: Number, default: 0 },
  },
  { timestamps: true }
);

const Analytics = model('Analytics', analyticsSchema);

export default Analytics;
