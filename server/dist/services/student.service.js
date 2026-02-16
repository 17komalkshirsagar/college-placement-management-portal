import fs from 'fs/promises';
import path from 'path';
import StudentProfile from '../models/Student.model.js';
import User from '../models/User.model.js';
import { env } from '../config/env.js';
import { ApiError } from '../utils/api-error.js';
import { ensureObjectId } from '../utils/object-id.js';
import { parsePagination } from '../validators/common.validator.js';
class StudentService {
    resumeDir = path.join(process.cwd(), 'uploads', 'resumes');
    async updateProfile(studentId, payload, actor) {
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
    async getById(studentId) {
        ensureObjectId(studentId, 'student id');
        const student = await StudentProfile.findById(studentId)
            .populate('user', 'fullName email roleName status')
            .lean();
        if (!student) {
            throw new ApiError(404, 'Student not found');
        }
        return student;
    }
    async getByUserId(userId) {
        ensureObjectId(userId, 'user id');
        const student = await StudentProfile.findOne({ user: userId })
            .populate('user', 'fullName email roleName status')
            .lean();
        if (!student) {
            throw new ApiError(404, 'Student not found');
        }
        return student;
    }
    async list(query) {
        const { page, limit, skip } = parsePagination(query);
        const branch = typeof query.branch === 'string' ? query.branch : undefined;
        const filter = {};
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
    async delete(studentId) {
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
    async deleteByUserId(userId) {
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
    async uploadResume(studentId, file) {
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
    async deleteResume(studentId) {
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
    async addSkill(studentId, skill, actor) {
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
        const updated = await StudentProfile.findByIdAndUpdate(studentId, { $push: { skills: trimmedSkill } }, { new: true }).lean();
        return updated;
    }
    async removeSkill(studentId, skill, actor) {
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
        const updated = await StudentProfile.findByIdAndUpdate(studentId, { $pull: { skills: { $regex: new RegExp(`^${normalizedSkill}$`, 'i') } } }, { new: true }).lean();
        return updated;
    }
}
export const studentService = new StudentService();
