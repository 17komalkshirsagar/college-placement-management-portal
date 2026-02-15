import type { Express } from 'express';
import fs from 'fs/promises';
import path from 'path';

import StudentProfile from '../models/Student.model.js';
import User from '../models/User.model.js';
import { env } from '../config/env.js';
import { ApiError } from '../utils/api-error.js';
import { ensureObjectId } from '../utils/object-id.js';
import { parsePagination } from '../validators/common.validator.js';
import type { UpdateStudentProfileDto } from '../validators/student.validator.js';

class StudentService {
  private resumeDir = path.join(process.cwd(), 'uploads', 'resumes');

  public async updateProfile(studentId: string, payload: UpdateStudentProfileDto, actor: { userId: string; role: string }) {
    ensureObjectId(studentId, 'student id');

    const student = await StudentProfile.findById(studentId).lean();
    if (!student) {
      throw new ApiError(404, 'Student not found');
    }

    if (actor.role === 'student' && student.user.toString() !== actor.userId) {
      throw new ApiError(403, 'You can update only your own profile');
    }

    const updated = await StudentProfile.findByIdAndUpdate(studentId, payload, { new: true, runValidators: true }).lean();
    return updated;
  }

  public async getById(studentId: string) {
    ensureObjectId(studentId, 'student id');

    const student = await StudentProfile.findById(studentId)
      .populate('user', 'fullName email roleName status')
      .lean();
    if (!student) {
      throw new ApiError(404, 'Student not found');
    }

    return student;
  }

  public async getByUserId(userId: string) {
    ensureObjectId(userId, 'user id');

    const student = await StudentProfile.findOne({ user: userId })
      .populate('user', 'fullName email roleName status')
      .lean();
    if (!student) {
      throw new ApiError(404, 'Student not found');
    }

    return student;
  }

  public async list(query: Record<string, unknown>) {
    const { page, limit, skip } = parsePagination(query);
    const branch = typeof query.branch === 'string' ? query.branch : undefined;

    const filter: Record<string, unknown> = {};
    if (branch) {
      filter.branch = branch;
    }

    const [items, total] = await Promise.all([
      StudentProfile.find(filter)
        .populate('user', 'fullName email status roleName')
        .skip(skip)
        .limit(limit)
        .sort({ createdAt: -1 })
        .lean(),
      StudentProfile.countDocuments(filter),
    ]);

    return {
      items,
      pagination: { page, limit, total, totalPages: Math.ceil(total / limit) },
    };
  }

  public async delete(studentId: string): Promise<{ message: string }> {
    ensureObjectId(studentId, 'student id');

    const student = await StudentProfile.findById(studentId).lean();
    if (!student) {
      throw new ApiError(404, 'Student not found');
    }

    await StudentProfile.findByIdAndDelete(studentId);
    await User.findByIdAndUpdate(student.user, {
      isDeleted: true,
      deletedAt: new Date(),
      status: 'inactive',
      refreshToken: null,
    });

    return { message: 'Student deleted successfully' };
  }

  public async deleteByUserId(userId: string): Promise<{ message: string }> {
    ensureObjectId(userId, 'user id');

    const student = await StudentProfile.findOne({ user: userId }).lean();
    if (!student) {
      throw new ApiError(404, 'Student not found');
    }

    await StudentProfile.findByIdAndDelete(student._id);
    await User.findByIdAndUpdate(student.user, {
      isDeleted: true,
      deletedAt: new Date(),
      status: 'inactive',
      refreshToken: null,
    });

    return { message: 'Student deleted successfully' };
  }

  public async uploadResume(studentId: string, file: Express.Multer.File) {
    ensureObjectId(studentId, 'student id');

    const student = await StudentProfile.findById(studentId);
    if (!student) {
      throw new ApiError(404, 'Student not found');
    }

    if (student.resumeFileName) {
      await fs.rm(path.join(this.resumeDir, student.resumeFileName), { force: true });
    }

    student.resumeFileName = file.filename;
    student.resumeUrl = `${env.UPLOADS_BASE_URL}/resumes/${file.filename}`;
    student.resumeUpdatedAt = new Date();
    await student.save();

    return student.toObject();
  }

  public async deleteResume(studentId: string) {
    ensureObjectId(studentId, 'student id');

    const student = await StudentProfile.findById(studentId);
    if (!student) {
      throw new ApiError(404, 'Student not found');
    }

    if (student.resumeFileName) {
      await fs.rm(path.join(this.resumeDir, student.resumeFileName), { force: true });
    }

    student.resumeFileName = null;
    student.resumeUrl = null;
    student.resumeUpdatedAt = null;
    await student.save();

    return student.toObject();
  }

  public async addSkill(studentId: string, skill: string, actor: { userId: string; role: string }) {
    ensureObjectId(studentId, 'student id');

    const trimmedSkill = skill.trim();
    if (!trimmedSkill) {
      throw new ApiError(400, 'Skill cannot be empty');
    }

    const student = await StudentProfile.findById(studentId).lean();
    if (!student) {
      throw new ApiError(404, 'Student not found');
    }

    if (actor.role === 'student' && student.user.toString() !== actor.userId) {
      throw new ApiError(403, 'You can only modify your own skills');
    }

    const normalizedSkill = trimmedSkill.toLowerCase();
    const existingSkills = (student.skills || []).map((s) => s.toLowerCase());
    if (existingSkills.includes(normalizedSkill)) {
      throw new ApiError(400, 'Skill already exists');
    }

    const updated = await StudentProfile.findByIdAndUpdate(
      studentId,
      { $push: { skills: trimmedSkill } },
      { new: true }
    ).lean();

    return updated;
  }

  public async removeSkill(studentId: string, skill: string, actor: { userId: string; role: string }) {
    ensureObjectId(studentId, 'student id');

    const trimmedSkill = skill.trim();
    if (!trimmedSkill) {
      throw new ApiError(400, 'Skill cannot be empty');
    }

    const student = await StudentProfile.findById(studentId).lean();
    if (!student) {
      throw new ApiError(404, 'Student not found');
    }

    if (actor.role === 'student' && student.user.toString() !== actor.userId) {
      throw new ApiError(403, 'You can only modify your own skills');
    }

    const normalizedSkill = trimmedSkill.toLowerCase();
    const existingSkills = (student.skills || []).map((s) => s.toLowerCase());
    if (!existingSkills.includes(normalizedSkill)) {
      throw new ApiError(404, 'Skill not found');
    }

    const updated = await StudentProfile.findByIdAndUpdate(
      studentId,
      { $pull: { skills: { $regex: new RegExp(`^${normalizedSkill}$`, 'i') } } },
      { new: true }
    ).lean();

    return updated;
  }
}

export const studentService = new StudentService();
