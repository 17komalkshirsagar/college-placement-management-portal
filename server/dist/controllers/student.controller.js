import { studentService } from '../services/student.service.js';
import { ApiError } from '../utils/api-error.js';
import { asyncHandler } from '../utils/async-handler.js';
import { getRequiredParam } from '../utils/request-param.js';
class StudentController {
    updateProfile = asyncHandler(async (req, res) => {
        if (!req.user) {
            throw new ApiError(401, 'Unauthorized');
        }
        const data = await studentService.updateProfile(getRequiredParam(req, 'studentId'), req.body, {
            userId: req.user.userId,
            role: req.user.role,
        });
        res.status(200).json(data);
    });
    getById = asyncHandler(async (req, res) => {
        const data = await studentService.getById(getRequiredParam(req, 'studentId'));
        res.status(200).json(data);
    });
    getOwnProfile = asyncHandler(async (req, res) => {
        if (!req.user) {
            throw new ApiError(401, 'Unauthorized');
        }
        const data = await studentService.getByUserId(req.user.userId);
        res.status(200).json(data);
    });
    deleteOwnProfile = asyncHandler(async (req, res) => {
        if (!req.user) {
            throw new ApiError(401, 'Unauthorized');
        }
        const data = await studentService.deleteByUserId(req.user.userId);
        res.status(200).json(data);
    });
    uploadResume = asyncHandler(async (req, res) => {
        if (!req.user) {
            throw new ApiError(401, 'Unauthorized');
        }
        if (!req.file) {
            throw new ApiError(400, 'Resume file is required');
        }
        const data = await studentService.uploadResume(getRequiredParam(req, 'studentId'), req.file);
        res.status(200).json(data);
    });
    deleteResume = asyncHandler(async (req, res) => {
        if (!req.user) {
            throw new ApiError(401, 'Unauthorized');
        }
        const data = await studentService.deleteResume(getRequiredParam(req, 'studentId'));
        res.status(200).json(data);
    });
    list = asyncHandler(async (req, res) => {
        const data = await studentService.list(req.query);
        res.status(200).json(data);
    });
    delete = asyncHandler(async (req, res) => {
        const data = await studentService.delete(getRequiredParam(req, 'studentId'));
        res.status(200).json(data);
    });
    addSkill = asyncHandler(async (req, res) => {
        if (!req.user) {
            throw new ApiError(401, 'Unauthorized');
        }
        const { skill } = req.body;
        if (!skill || typeof skill !== 'string') {
            throw new ApiError(400, 'Skill is required');
        }
        const data = await studentService.addSkill(getRequiredParam(req, 'studentId'), skill, {
            userId: req.user.userId,
            role: req.user.role,
        });
        res.status(200).json(data);
    });
    removeSkill = asyncHandler(async (req, res) => {
        if (!req.user) {
            throw new ApiError(401, 'Unauthorized');
        }
        const { skill } = req.body;
        if (!skill || typeof skill !== 'string') {
            throw new ApiError(400, 'Skill is required');
        }
        const data = await studentService.removeSkill(getRequiredParam(req, 'studentId'), skill, {
            userId: req.user.userId,
            role: req.user.role,
        });
        res.status(200).json(data);
    });
}
export const studentController = new StudentController();
