import Application from '../models/Application.model.js';
import Company from '../models/Company.model.js';
import Interview from '../models/Interview.model.js';
import Job from '../models/Job.model.js';
import { ApiError } from '../utils/api-error.js';
import { ensureObjectId } from '../utils/object-id.js';
import type { ScheduleInterviewDto, UpdateInterviewStatusDto } from '../validators/interview.validator.js';

class InterviewService {
  public async schedule(payload: ScheduleInterviewDto, actor: { userId: string; role: string }) {
    ensureObjectId(payload.applicationId, 'application id');

    const application = await Application.findById(payload.applicationId).lean();
    if (!application) {
      throw new ApiError(404, 'Application not found');
    }

    if (actor.role === 'company') {
      const company = await Company.findOne({ user: actor.userId }).lean();
      const job = await Job.findById(application.job).lean();
      if (!company || !job || job.company.toString() !== company._id.toString()) {
        throw new ApiError(403, 'Forbidden');
      }
    }

    const interview = await Interview.create({
      application: payload.applicationId,
      scheduledAt: new Date(payload.scheduledAt),
      mode: payload.mode,
      round: payload.round,
      status: 'scheduled',
      result: 'pending',
    });

    await Application.findByIdAndUpdate(payload.applicationId, { status: 'shortlisted' });

    return { id: interview._id.toString(), message: 'Interview scheduled successfully' };
  }

  public async updateStatus(interviewId: string, payload: UpdateInterviewStatusDto) {
    ensureObjectId(interviewId, 'interview id');

    const updatePayload: Record<string, unknown> = { ...payload };
    if (payload.scheduledAt) {
      updatePayload.scheduledAt = new Date(payload.scheduledAt);
    }

    const interview = await Interview.findByIdAndUpdate(interviewId, updatePayload, { new: true, runValidators: true }).lean();
    if (!interview) {
      throw new ApiError(404, 'Interview not found');
    }

    return interview;
  }

  public async cancel(interviewId: string) {
    ensureObjectId(interviewId, 'interview id');

    const interview = await Interview.findByIdAndUpdate(
      interviewId,
      { status: 'cancelled', result: 'failed' },
      { new: true, runValidators: true }
    ).lean();

    if (!interview) {
      throw new ApiError(404, 'Interview not found');
    }

    return interview;
  }
}

export const interviewService = new InterviewService();
