import type { Request, Response } from 'express';

import { resumeUploadMiddleware } from '../middlewares/upload.middleware.js';
import { studentService } from '../services/student.service.js';
import { ApiError } from '../utils/api-error.js';
import { asyncHandler } from '../utils/async-handler.js';
import { getRequiredParam } from '../utils/request-param.js';

interface MulterRequest extends Request {
  file?: Express.Multer.File;
}

class StudentController {
  public updateProfile = asyncHandler(async (req: Request, res: Response) => {
    if (!req.user) {
      throw new ApiError(401, 'Unauthorized');
    }

    const data = await studentService.updateProfile(getRequiredParam(req, 'studentId'), req.body, {
      userId: req.user.userId,
      role: req.user.role,
    });
    res.status(200).json(data);
  });

  public getById = asyncHandler(async (req: Request, res: Response) => {
    const data = await studentService.getById(getRequiredParam(req, 'studentId'));
    res.status(200).json(data);
  });

  public getOwnProfile = asyncHandler(async (req: Request, res: Response) => {
    if (!req.user) {
      throw new ApiError(401, 'Unauthorized');
    }

    const data = await studentService.getByUserId(req.user.userId);
    res.status(200).json(data);
  });

  public deleteOwnProfile = asyncHandler(async (req: Request, res: Response) => {
    if (!req.user) {
      throw new ApiError(401, 'Unauthorized');
    }

    const data = await studentService.deleteByUserId(req.user.userId);
    res.status(200).json(data);
  });

  public uploadResume = asyncHandler(async (req: MulterRequest, res: Response) => {
    if (!req.user) {
      throw new ApiError(401, 'Unauthorized');
    }
    if (!req.file) {
      throw new ApiError(400, 'Resume file is required');
    }

    const data = await studentService.uploadResume(getRequiredParam(req, 'studentId'), req.file);
    res.status(200).json(data);
  });

  public deleteResume = asyncHandler(async (req: Request, res: Response) => {
    if (!req.user) {
      throw new ApiError(401, 'Unauthorized');
    }

    const data = await studentService.deleteResume(getRequiredParam(req, 'studentId'));
    res.status(200).json(data);
  });

  public list = asyncHandler(async (req: Request, res: Response) => {
    const data = await studentService.list(req.query as Record<string, unknown>);
    res.status(200).json(data);
  });

  public delete = asyncHandler(async (req: Request, res: Response) => {
    const data = await studentService.delete(getRequiredParam(req, 'studentId'));
    res.status(200).json(data);
  });

  public addSkill = asyncHandler(async (req: Request, res: Response) => {
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

  public removeSkill = asyncHandler(async (req: Request, res: Response) => {
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
