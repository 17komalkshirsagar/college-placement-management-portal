import Application from '../models/Application.model.js';
import CompanyProfile from '../models/Company.model.js';
import Job from '../models/Job.model.js';
import StudentProfile from '../models/Student.model.js';
import User from '../models/User.model.js';
import { ApiError } from '../utils/api-error.js';
import { ensureObjectId } from '../utils/object-id.js';
import { parsePagination } from '../validators/common.validator.js';
import type { ApplyJobDto, UpdateApplicationStatusDto } from '../validators/application.validator.js';
import { sendMail } from '../utils/mailer.js';
import { notificationService } from './notification.service.js';
import { emailTemplate } from '../utils/email-template.js';

const statusEmailMap: Record<UpdateApplicationStatusDto['status'], { subject: string; message: string }> = {
  shortlisted: {
    subject: 'Application Shortlisted',
    message: 'Your application has been shortlisted.',
  },
  rejected: {
    subject: 'Application Rejected',
    message: 'Your application has been rejected.',
  },
  selected: {
    subject: 'Application Selected',
    message: 'Congratulations. You have been selected.',
  },
};

class ApplicationService {
  public async applyToJob(userId: string, payload: ApplyJobDto) {
    ensureObjectId(payload.jobId, 'job id');

    const student = await StudentProfile.findOne({ user: userId }).lean();
    if (!student) {
      throw new ApiError(403, 'Student profile required to apply');
    }

    const job = await Job.findById(payload.jobId).lean();
    if (!job || !job.isActive) {
      throw new ApiError(400, 'Job is not open for applications');
    }

    if (job.deadline.getTime() < Date.now()) {
      throw new ApiError(400, 'Application deadline has passed');
    }

    const duplicate = await Application.findOne({ student: student._id, job: payload.jobId }).lean();
    if (duplicate) {
      throw new ApiError(409, 'Duplicate application is not allowed');
    }

    const application = await Application.create({
      student: student._id,
      job: payload.jobId,
      resumeUrl: payload.resumeUrl,
      coverLetter: payload.coverLetter,
      status: 'applied',
      decisionHistory: [{ status: 'applied', updatedAt: new Date() }],
    });

    const studentUser = await User.findById(userId).lean();
    if (studentUser) {
      const jobWithCompany = await Job.findById(payload.jobId).populate('company').lean();
      const companyName = jobWithCompany?.company ? (jobWithCompany.company as { companyName?: string }).companyName : 'the company';
      
      const emailContent = `
        ${emailTemplate.heading('Application Submitted Successfully')}
        ${emailTemplate.paragraph(`Dear ${studentUser.fullName},`)}
        ${emailTemplate.paragraph(`Your job application has been successfully submitted to <strong>${companyName}</strong> for the position of <strong>${jobWithCompany?.title || 'the posted job'}</strong>.`)}
        ${emailTemplate.paragraph('You can track the status of your application in your student dashboard.')}
        ${emailTemplate.divider()}
        ${emailTemplate.paragraph('<strong>Application Details:</strong>')}
        ${emailTemplate.bulletList([
          `Position: ${jobWithCompany?.title || 'N/A'}`,
          `Company: ${companyName}`,
          `Location: ${jobWithCompany?.location || 'N/A'}`,
          `Package: ${jobWithCompany?.packageLpa ? `${jobWithCompany.packageLpa} LPA` : 'N/A'}`,
          `Applied On: ${new Date().toLocaleDateString('en-IN', { day: 'numeric', month: 'long', year: 'numeric' })}`
        ])}
        ${emailTemplate.divider()}
        ${emailTemplate.paragraph('Thank you for using the Placement Portal.')}
        ${emailTemplate.signature('Training & Placement Officer')}
      `;
      
      await sendMail({
        to: studentUser.email,
        subject: `Job Application Submitted - ${jobWithCompany?.title || 'Position'}`,
        html: emailTemplate.wrap(emailContent, `Job Application Submitted - ${jobWithCompany?.title || 'Position'}`),
      });

      await notificationService.create(studentUser._id.toString(), 'Job Application Submitted', 'Your application has been submitted.', {
        applicationId: application._id.toString(),
      });
    }

    return { id: application._id.toString(), message: 'Application submitted successfully' };
  }

  public async getById(applicationId: string, actor: { userId: string; role: string }) {
    ensureObjectId(applicationId, 'application id');

    const application = (await Application.findById(applicationId)
      .populate({ path: 'student', populate: { path: 'user', select: 'fullName email' }, select: 'course branch year skills resumeUrl' })
      .populate({ path: 'job', populate: { path: 'company' } })
      .lean()) as {
      student: { _id: { toString: () => string } };
    } | null;

    if (!application) {
      throw new ApiError(404, 'Application not found');
    }

    if (actor.role === 'student') {
      const student = await StudentProfile.findOne({ user: actor.userId }).lean();
      if (!student || student._id.toString() !== application.student._id.toString()) {
        throw new ApiError(403, 'Forbidden');
      }
    }

    return application;
  }

  public async list(query: Record<string, unknown>, actor: { userId: string; role: string }) {
    const { page, limit, skip } = parsePagination(query);

    const filter: Record<string, unknown> = {};

    if (typeof query.jobId === 'string') {
      filter.job = query.jobId;
    }

    if (actor.role === 'student') {
      const student = await StudentProfile.findOne({ user: actor.userId }).lean();
      if (!student) {
        throw new ApiError(403, 'Student profile not found');
      }
      filter.student = student._id;
    }

    if (actor.role === 'company') {
      const company = await CompanyProfile.findOne({ user: actor.userId }).lean();
      if (!company) {
        throw new ApiError(403, 'Company profile not found');
      }

      const companyJobs = await Job.find({ company: company._id }).select('_id').lean();
      filter.job = { $in: companyJobs.map((job) => job._id) };
    }

    const [items, total] = await Promise.all([
      Application.find(filter)
        .populate({ path: 'student', populate: { path: 'user', select: 'fullName email' }, select: 'course branch year skills resumeUrl' })
        .populate({ path: 'job', populate: { path: 'company' } })
        .skip(skip)
        .limit(limit)
        .sort({ createdAt: -1 })
        .lean(),
      Application.countDocuments(filter),
    ]);

    return {
      items,
      pagination: { page, limit, total, totalPages: Math.ceil(total / limit) },
    };
  }

  public async updateStatus(applicationId: string, payload: UpdateApplicationStatusDto, actor: { userId: string; role: string }) {
    ensureObjectId(applicationId, 'application id');

    const application = (await Application.findById(applicationId)
      .populate({ path: 'job', select: 'company title' })
      .populate({ path: 'student', select: 'user' })
      .lean()) as {
      _id: { toString: () => string };
      decisionHistory?: Array<{ status: string; updatedAt: Date }>;
      job: { company: { toString: () => string }; title?: string };
      student: { user: { toString: () => string } };
    } | null;

    if (!application) {
      throw new ApiError(404, 'Application not found');
    }

    if (actor.role === 'company') {
      const company = await CompanyProfile.findOne({ user: actor.userId }).lean();
      if (!company || company._id.toString() !== application.job.company.toString()) {
        throw new ApiError(403, 'Forbidden');
      }
    }

    const updatedHistory = [...(application.decisionHistory ?? []), { status: payload.status, updatedAt: new Date() }];

    const updated = await Application.findByIdAndUpdate(
      applicationId,
      { status: payload.status, decisionHistory: updatedHistory },
      { new: true }
    ).lean();

    const studentUser = await User.findById(application.student.user.toString()).lean();
    if (studentUser) {
      const emailData = statusEmailMap[payload.status];
      const jobData = await Job.findById(applicationId).populate('company').lean();
      const companyName = jobData?.company ? (jobData.company as { companyName?: string }).companyName : 'the company';
      
      let statusMessage = '';
      let alertType: 'success' | 'warning' | 'info' = 'info';
      
      switch (payload.status) {
        case 'shortlisted':
          statusMessage = 'Congratulations! You have been shortlisted for the next round of selection.';
          alertType = 'success';
          break;
        case 'rejected':
          statusMessage = 'We regret to inform you that your application has not been selected at this time.';
          alertType = 'warning';
          break;
        case 'selected':
          statusMessage = 'Congratulations! You have been selected for the position. Please check your dashboard for further details.';
          alertType = 'success';
          break;
      }
      
      const emailContent = `
        ${emailTemplate.heading(emailData.subject)}
        ${emailTemplate.paragraph(`Dear ${studentUser.fullName},`)}
        ${emailTemplate.alertBox('Application Status Update', statusMessage, alertType)}
        ${emailTemplate.divider()}
        ${emailTemplate.paragraph('<strong>Application Details:</strong>')}
        ${emailTemplate.bulletList([
          `Position: ${jobData?.title || 'N/A'}`,
          `Company: ${companyName}`,
          `Location: ${jobData?.location || 'N/A'}`,
          `Package: ${jobData?.packageLpa ? `${jobData.packageLpa} LPA` : 'N/A'}`,
          `Status: ${payload.status.charAt(0).toUpperCase() + payload.status.slice(1)}`,
          `Updated On: ${new Date().toLocaleDateString('en-IN', { day: 'numeric', month: 'long', year: 'numeric' })}`
        ])}
        ${emailTemplate.divider()}
        ${emailTemplate.paragraph('Thank you for using the Placement Portal. We wish you the best for your career.')}
        ${emailTemplate.signature('Training & Placement Officer')}
      `;
      
      await sendMail({
        to: studentUser.email,
        subject: emailData.subject,
        html: emailTemplate.wrap(emailContent, emailData.subject),
      });

      await notificationService.create(studentUser._id.toString(), emailData.subject, emailData.message, {
        applicationId: application._id.toString(),
        status: payload.status,
      });
    }

    if (payload.status === 'selected') {
      const admins = await User.find({ roleName: 'admin', isDeleted: false, status: 'active' }).lean();
      const jobData = await Job.findById(applicationId).populate('company').populate({ path: 'student', populate: { path: 'user' } }).lean();
      
      await Promise.all(
        admins.map(async (admin) => {
          const studentData = await StudentProfile.findById(application.student._id).populate('user').lean();
          const studentName = studentData?.user ? (studentData.user as { fullName?: string }).fullName : 'a student';
          
          const emailContent = `
            ${emailTemplate.heading('Candidate Selected')}
            ${emailTemplate.paragraph(`Dear Admin,`)}
            ${emailTemplate.alertBox('Selection Notification', `A candidate has been selected for the position.`, 'success')}
            ${emailTemplate.divider()}
            ${emailTemplate.paragraph('<strong>Selection Details:</strong>')}
            ${emailTemplate.bulletList([
              `Student: ${studentName}`,
              `Position: ${jobData?.title || 'N/A'}`,
              `Company: ${jobData?.company ? (jobData.company as { companyName?: string }).companyName : 'N/A'}`,
              `Package: ${jobData?.packageLpa ? `${jobData.packageLpa} LPA` : 'N/A'}`,
              `Selected On: ${new Date().toLocaleDateString('en-IN', { day: 'numeric', month: 'long', year: 'numeric' })}`
            ])}
            ${emailTemplate.divider()}
            ${emailTemplate.paragraph('Please review the selection in the admin dashboard.')}
          `;
          
          await sendMail({
            to: admin.email,
            subject: 'Candidate Selected - Placement Portal',
            html: emailTemplate.wrap(emailContent, 'Candidate Selected'),
          });
        })
      );
    }

    return updated;
  }
}

export const applicationService = new ApplicationService();
