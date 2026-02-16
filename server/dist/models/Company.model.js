import { Schema, model } from 'mongoose';
const companyProfileSchema = new Schema({
    user: { type: Schema.Types.ObjectId, ref: 'User', required: true, unique: true },
    companyName: { type: String, required: true, trim: true },
    hrEmail: { type: String, required: true, trim: true, lowercase: true },
    hrMobileNumber: { type: String, required: true, trim: true },
    website: { type: String, trim: true },
    industry: { type: String, trim: true },
    headquarters: { type: String, trim: true },
    isActive: { type: Boolean, default: true },
}, { timestamps: true });
const CompanyProfile = model('CompanyProfile', companyProfileSchema);
export default CompanyProfile;
