import type { Request, Response } from 'express';

import { applicationService } from '../services/application.service.js';
import { asyncHandler } from '../utils/async-handler.js';
import { ApiError } from '../utils/api-error.js';
import { getRequiredParam } from '../utils/request-param.js';

class ApplicationController {
  public apply = asyncHandler(async (req: Request, res: Response) => {
    if (!req.user) {
      throw new ApiError(401, 'Unauthorized');
    }

    const data = await applicationService.applyToJob(req.user.userId, req.body);
    res.status(201).json(data);
  });

  public getById = asyncHandler(async (req: Request, res: Response) => {
    if (!req.user) {
      throw new ApiError(401, 'Unauthorized');
    }

    const data = await applicationService.getById(getRequiredParam(req, 'applicationId'), {
      userId: req.user.userId,
      role: req.user.role,
    });
    res.status(200).json(data);
  });

  public list = asyncHandler(async (req: Request, res: Response) => {
    if (!req.user) {
      throw new ApiError(401, 'Unauthorized');
    }

    const data = await applicationService.list(req.query as Record<string, unknown>, {
      userId: req.user.userId,
      role: req.user.role,
    });
    res.status(200).json(data);
  });

  public updateStatus = asyncHandler(async (req: Request, res: Response) => {
    if (!req.user) {
      throw new ApiError(401, 'Unauthorized');
    }

    const data = await applicationService.updateStatus(getRequiredParam(req, 'applicationId'), req.body, {
      userId: req.user.userId,
      role: req.user.role,
    });
    res.status(200).json(data);
  });
}

export const applicationController = new ApplicationController();
