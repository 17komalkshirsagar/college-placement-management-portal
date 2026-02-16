import { Schema, model } from 'mongoose';
const jobSchema = new Schema({
    company: { type: Schema.Types.ObjectId, ref: 'CompanyProfile', required: true },
    title: { type: String, required: true, trim: true },
    description: { type: String, required: true, trim: true },
    location: { type: String, required: true, trim: true },
    packageLpa: { type: Number, required: true },
    eligibility: { type: String, required: true, trim: true },
    deadline: { type: Date, required: true },
    isActive: { type: Boolean, default: true },
}, { timestamps: true });
const Job = model('Job', jobSchema);
export default Job;
