import CompanyProfile from '../models/Company.model.js';
import Job from '../models/Job.model.js';
import User from '../models/User.model.js';
import { ApiError } from '../utils/api-error.js';
import { ensureObjectId } from '../utils/object-id.js';
import { parsePagination } from '../validators/common.validator.js';
import type {
  AdminUpdateCompanyDto,
  AdminUpdateCompanyStatusDto,
  UpdateCompanyActivationDto,
  UpdateCompanyProfileDto,
} from '../validators/company.validator.js';

class CompanyService {
  public async updateProfile(companyId: string, payload: UpdateCompanyProfileDto, actor: { userId: string; role: string }) {
    ensureObjectId(companyId, 'company id');

    const company = await CompanyProfile.findById(companyId).lean();
    if (!company) {
      throw new ApiError(404, 'Company not found');
    }

    if (actor.role === 'company' && company.user.toString() !== actor.userId) {
      throw new ApiError(403, 'You can update only your own company profile');
    }

    const updated = await CompanyProfile.findByIdAndUpdate(companyId, payload, { new: true, runValidators: true }).lean();
    return updated;
  }

  public async updateActivation(companyId: string, payload: UpdateCompanyActivationDto) {
    ensureObjectId(companyId, 'company id');

    const company = await CompanyProfile.findByIdAndUpdate(companyId, { isActive: payload.isActive }, { new: true }).lean();
    if (!company) {
      throw new ApiError(404, 'Company not found');
    }

    await User.findByIdAndUpdate(company.user, { status: payload.isActive ? 'active' : 'inactive' });
    return company;
  }

  public async adminGetCompany(companyId: string) {
    ensureObjectId(companyId, 'company id');

    const company = await CompanyProfile.findById(companyId).populate('user', 'fullName email status roleName').lean();
    if (!company) {
      throw new ApiError(404, 'Company not found');
    }

    const jobsPosted = await Job.countDocuments({ company: company._id });

    return { ...company, jobsPosted };
  }

  public async adminUpdateCompany(companyId: string, payload: AdminUpdateCompanyDto) {
    ensureObjectId(companyId, 'company id');

    const company = await CompanyProfile.findById(companyId);
    if (!company) {
      throw new ApiError(404, 'Company not found');
    }

    if (payload.hrEmail && payload.hrEmail.toLowerCase() !== company.hrEmail) {
      const existing = await User.findOne({ email: payload.hrEmail.toLowerCase() });
      if (existing && existing._id.toString() !== company.user.toString()) {
        throw new ApiError(409, 'HR email already in use');
      }
    }

    if (payload.companyName) {
      company.companyName = payload.companyName;
    }

    if (payload.hrEmail) {
      company.hrEmail = payload.hrEmail.toLowerCase();
      await User.findByIdAndUpdate(company.user, {
        email: payload.hrEmail.toLowerCase(),
        fullName: payload.companyName ?? company.companyName,
      });
    }

    if (payload.hrMobileNumber) {
      company.hrMobileNumber = payload.hrMobileNumber;
    }

    if (typeof payload.isActive === 'boolean') {
      company.isActive = payload.isActive;
      await User.findByIdAndUpdate(company.user, { status: payload.isActive ? 'active' : 'inactive' });
    }

    await company.save();
    return company.toObject();
  }

  public async adminUpdateStatus(companyId: string, payload: AdminUpdateCompanyStatusDto) {
    ensureObjectId(companyId, 'company id');

    const company = await CompanyProfile.findByIdAndUpdate(companyId, { isActive: payload.isActive }, { new: true }).lean();
    if (!company) {
      throw new ApiError(404, 'Company not found');
    }

    await User.findByIdAndUpdate(company.user, { status: payload.isActive ? 'active' : 'inactive' });
    return company;
  }

  public async adminDeleteCompany(companyId: string) {
    ensureObjectId(companyId, 'company id');

    const company = await CompanyProfile.findByIdAndDelete(companyId);
    if (!company) {
      throw new ApiError(404, 'Company not found');
    }

    await User.findByIdAndUpdate(company.user, {
      isDeleted: true,
      deletedAt: new Date(),
      status: 'inactive',
      refreshToken: null,
    });

    return { message: 'Company deleted successfully' };
  }

  public async listCompanies(query: Record<string, unknown>) {
    const { page, limit, skip } = parsePagination(query);
    const isActive =
      typeof query.isActive === 'string' ? (query.isActive === 'true' ? true : query.isActive === 'false' ? false : undefined) : undefined;

    const filter: Record<string, unknown> = {};
    if (typeof isActive === 'boolean') {
      filter.isActive = isActive;
    }

    const [items, total] = await Promise.all([
      CompanyProfile.find(filter)
        .populate('user', 'fullName email status roleName')
        .skip(skip)
        .limit(limit)
        .sort({ createdAt: -1 })
        .lean(),
      CompanyProfile.countDocuments(filter),
    ]);

    return {
      items,
      pagination: { page, limit, total, totalPages: Math.ceil(total / limit) },
    };
  }
}

export const companyService = new CompanyService();
