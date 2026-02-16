import CompanyProfile from '../models/Company.model.js';
import Job from '../models/Job.model.js';
import { ApiError } from '../utils/api-error.js';
import { ensureObjectId } from '../utils/object-id.js';
import { parsePagination } from '../validators/common.validator.js';
class JobService {
    async createJob(userId, payload) {
        const company = await CompanyProfile.findOne({ user: userId, isActive: true }).lean();
        if (!company) {
            throw new ApiError(403, 'Active company profile is required to create jobs');
        }
        const job = await Job.create({ ...payload, deadline: new Date(payload.deadline), company: company._id });
        return { id: job._id.toString(), message: 'Job created successfully' };
    }
    async updateJob(jobId, payload, actor) {
        ensureObjectId(jobId, 'job id');
        const job = await Job.findById(jobId).lean();
        if (!job) {
            throw new ApiError(404, 'Job not found');
        }
        if (actor.role === 'company') {
            const company = await CompanyProfile.findOne({ user: actor.userId }).lean();
            if (!company || company._id.toString() !== job.company.toString()) {
                throw new ApiError(403, 'You can update only your own jobs');
            }
        }
        const updatePayload = { ...payload };
        if (payload.deadline) {
            updatePayload.deadline = new Date(payload.deadline);
        }
        const updated = await Job.findByIdAndUpdate(jobId, updatePayload, { new: true, runValidators: true }).lean();
        return updated;
    }
    async closeJob(jobId, actor) {
        ensureObjectId(jobId, 'job id');
        if (actor.role === 'company') {
            const company = await CompanyProfile.findOne({ user: actor.userId }).lean();
            if (!company) {
                throw new ApiError(403, 'Company profile not found');
            }
            const updated = await Job.findOneAndUpdate({ _id: jobId, company: company._id }, { isActive: false }, { new: true }).lean();
            if (!updated) {
                throw new ApiError(404, 'Job not found');
            }
            return updated;
        }
        const updated = await Job.findByIdAndUpdate(jobId, { isActive: false }, { new: true }).lean();
        if (!updated) {
            throw new ApiError(404, 'Job not found');
        }
        return updated;
    }
    async deleteJob(jobId, actor) {
        ensureObjectId(jobId, 'job id');
        if (actor.role === 'company') {
            const company = await CompanyProfile.findOne({ user: actor.userId }).lean();
            if (!company) {
                throw new ApiError(403, 'Company profile not found');
            }
            const deleted = await Job.findOneAndDelete({ _id: jobId, company: company._id }).lean();
            if (!deleted) {
                throw new ApiError(404, 'Job not found');
            }
            return { message: 'Job deleted successfully' };
        }
        const deleted = await Job.findByIdAndDelete(jobId).lean();
        if (!deleted) {
            throw new ApiError(404, 'Job not found');
        }
        return { message: 'Job deleted successfully' };
    }
    async listJobs(query) {
        const { page, limit, skip } = parsePagination(query);
        const filter = {};
        if (typeof query.isActive === 'string') {
            if (query.isActive === 'true')
                filter.isActive = true;
            if (query.isActive === 'false')
                filter.isActive = false;
        }
        if (typeof query.location === 'string') {
            filter.location = { $regex: query.location, $options: 'i' };
        }
        if (typeof query.eligibility === 'string') {
            filter.eligibility = { $regex: query.eligibility, $options: 'i' };
        }
        if (typeof query.companyId === 'string') {
            filter.company = query.companyId;
        }
        const [items, total] = await Promise.all([
            Job.find(filter).populate('company').skip(skip).limit(limit).sort({ createdAt: -1 }).lean(),
            Job.countDocuments(filter),
        ]);
        return {
            items,
            pagination: { page, limit, total, totalPages: Math.ceil(total / limit) },
        };
    }
}
export const jobService = new JobService();
