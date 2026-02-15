import type { Request, Response } from 'express';

import { interviewService } from '../services/interview.service.js';
import { asyncHandler } from '../utils/async-handler.js';
import { ApiError } from '../utils/api-error.js';
import { getRequiredParam } from '../utils/request-param.js';

class InterviewController {
  public schedule = asyncHandler(async (req: Request, res: Response) => {
    if (!req.user) {
      throw new ApiError(401, 'Unauthorized');
    }

    const data = await interviewService.schedule(req.body, {
      userId: req.user.userId,
      role: req.user.role,
    });
    res.status(201).json(data);
  });

  public updateStatus = asyncHandler(async (req: Request, res: Response) => {
    const data = await interviewService.updateStatus(getRequiredParam(req, 'interviewId'), req.body);
    res.status(200).json(data);
  });

  public cancel = asyncHandler(async (req: Request, res: Response) => {
    const data = await interviewService.cancel(getRequiredParam(req, 'interviewId'));
    res.status(200).json(data);
  });
}

export const interviewController = new InterviewController();
