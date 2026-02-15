import Role from '../models/Role.model.js';
import CompanyProfile from '../models/Company.model.js';
import StudentProfile from '../models/Student.model.js';
import User from '../models/User.model.js';
import { env } from '../config/env.js';
import { ApiError } from '../utils/api-error.js';
import { ensureObjectId } from '../utils/object-id.js';
import { hashPassword } from '../utils/password.js';
import { generateAccountPassword } from '../utils/password-generator.js';
import { parsePagination } from '../validators/common.validator.js';
import type { CreateCompanyAccountDto, CreateStudentAccountDto, UpdateUserDto } from '../validators/user.validator.js';
import { sendMail } from '../utils/mailer.js';
import { emailTemplate } from '../utils/email-template.js';

class UserService {
  public async createStudentAccount(payload: CreateStudentAccountDto): Promise<{ id: string; message: string }> {
    const existing = await User.findOne({ email: payload.email }).lean();
    if (existing) {
      throw new ApiError(409, 'Student email already exists');
    }

    const role = await Role.findOne({ name: 'student' }).lean();
    if (!role) {
      throw new ApiError(400, 'Student role does not exist');
    }

    const plainPassword = generateAccountPassword(payload.fullName, payload.mobileNumber);
    const hashedPassword = await hashPassword(plainPassword);

    const user = await User.create({
      fullName: payload.fullName,
      email: payload.email,
      password: hashedPassword,
      role: role._id,
      roleName: 'student',
      isVerified: true,
      status: 'active',
    });

    await StudentProfile.create({
      user: user._id,
      mobileNumber: payload.mobileNumber,
      course: payload.course,
      branch: payload.branch,
      year: payload.year,
      skills: [],
    });

    await sendMail({
      to: payload.email,
      subject: 'Your Student Account Credentials',
      html: emailTemplate.wrap(`
        ${emailTemplate.heading('Welcome to Placement Portal!')}
        ${emailTemplate.paragraph(`Dear ${payload.fullName},`)}
        ${emailTemplate.paragraph('Your student account has been created by Admin/TPO. You can now access the placement portal using your credentials below.')}
        ${emailTemplate.divider()}
        ${emailTemplate.paragraph('<strong>Your Login Credentials:</strong>')}
        ${emailTemplate.bulletList([
          `Login Email: ${payload.email}`,
          `Password: ${plainPassword}`,
          `Login URL: ${env.LOGIN_URL}`
        ])}
        ${emailTemplate.divider()}
        ${emailTemplate.alertBox('Important', 'Please change your password after first login for security purposes.', 'info')}
        ${emailTemplate.paragraph('Complete your profile by uploading your resume and updating your skills to increase your chances of getting placed.')}
        ${emailTemplate.button('Login to Portal', env.LOGIN_URL)}
        ${emailTemplate.divider()}
        ${emailTemplate.paragraph('Best regards,')}
        ${emailTemplate.signature('Training & Placement Officer')}
      `, 'Your Student Account Credentials'),
    });

    return { id: user._id.toString(), message: 'Student account created successfully' };
  }

  public async createCompanyAccount(payload: CreateCompanyAccountDto): Promise<{ id: string; message: string }> {
    const existing = await User.findOne({ email: payload.hrEmail }).lean();
    if (existing) {
      throw new ApiError(409, 'Company HR email already exists');
    }

    const role = await Role.findOne({ name: 'company' }).lean();
    if (!role) {
      throw new ApiError(400, 'Company role does not exist');
    }

    const plainPassword = generateAccountPassword(payload.companyName, payload.hrMobileNumber);
    const hashedPassword = await hashPassword(plainPassword);

    const user = await User.create({
      fullName: payload.companyName,
      email: payload.hrEmail,
      password: hashedPassword,
      role: role._id,
      roleName: 'company',
      isVerified: true,
      status: 'active',
    });

    await CompanyProfile.create({
      user: user._id,
      companyName: payload.companyName,
      hrEmail: payload.hrEmail,
      hrMobileNumber: payload.hrMobileNumber,
      website: payload.website,
      industry: payload.industry,
      headquarters: payload.headquarters,
      isActive: true,
    });

    await sendMail({
      to: payload.hrEmail,
      subject: 'Your Company Account Credentials',
      html: emailTemplate.wrap(`
        ${emailTemplate.heading('Welcome to Placement Portal!')}
        ${emailTemplate.paragraph(`Dear ${payload.companyName},`)}
        ${emailTemplate.paragraph('Your company account has been created by Admin/TPO. You can now access the placement portal to post jobs and review applications.')}
        ${emailTemplate.divider()}
        ${emailTemplate.paragraph('<strong>Your Login Credentials:</strong>')}
        ${emailTemplate.bulletList([
          `Login Email: ${payload.hrEmail}`,
          `Password: ${plainPassword}`,
          `Login URL: ${env.LOGIN_URL}`
        ])}
        ${emailTemplate.divider()}
        ${emailTemplate.alertBox('Important', 'Please change your password after first login for security purposes.', 'info')}
        ${emailTemplate.paragraph('You can now post job openings, review student applications, and manage your recruitment process through the portal.')}
        ${emailTemplate.button('Login to Portal', env.LOGIN_URL)}
        ${emailTemplate.divider()}
        ${emailTemplate.paragraph('Best regards,')}
        ${emailTemplate.signature('Training & Placement Officer')}
      `, 'Your Company Account Credentials'),
    });

    return { id: user._id.toString(), message: 'Company account created successfully' };
  }

  public async getUserById(userId: string) {
    ensureObjectId(userId, 'user id');

    const user = await User.findOne({ _id: userId, isDeleted: false }).select('-password -refreshToken').lean();
    if (!user) {
      throw new ApiError(404, 'User not found');
    }

    return user;
  }

  public async listUsers(query: Record<string, unknown>) {
    const { page, limit, skip } = parsePagination(query);
    const role = typeof query.role === 'string' ? query.role : undefined;
    const search = typeof query.search === 'string' ? query.search : undefined;

    const filter: Record<string, unknown> = { isDeleted: false };
    if (role) {
      filter.roleName = role;
    }
    if (search) {
      filter.$or = [{ fullName: { $regex: search, $options: 'i' } }, { email: { $regex: search, $options: 'i' } }];
    }

    const [items, total] = await Promise.all([
      User.find(filter).select('-password -refreshToken').skip(skip).limit(limit).sort({ createdAt: -1 }).lean(),
      User.countDocuments(filter),
    ]);

    return {
      items,
      pagination: { page, limit, total, totalPages: Math.ceil(total / limit) },
    };
  }

  public async updateUser(userId: string, payload: UpdateUserDto) {
    ensureObjectId(userId, 'user id');

    const user = await User.findOneAndUpdate({ _id: userId, isDeleted: false }, payload, {
      new: true,
      runValidators: true,
    })
      .select('-password -refreshToken')
      .lean();

    if (!user) {
      throw new ApiError(404, 'User not found');
    }

    return user;
  }

  public async softDeleteUser(userId: string): Promise<{ message: string }> {
    ensureObjectId(userId, 'user id');

    const user = await User.findOneAndUpdate(
      { _id: userId, isDeleted: false },
      { isDeleted: true, deletedAt: new Date(), status: 'inactive', refreshToken: null },
      { new: true }
    ).lean();

    if (!user) {
      throw new ApiError(404, 'User not found');
    }

    return { message: 'User soft deleted successfully' };
  }
}

export const userService = new UserService();
