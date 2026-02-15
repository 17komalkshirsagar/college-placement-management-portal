import type { Request, Response } from 'express';

import { companyService } from '../services/company.service.js';
import { asyncHandler } from '../utils/async-handler.js';
import { ApiError } from '../utils/api-error.js';
import { getRequiredParam } from '../utils/request-param.js';

class CompanyController {
  public update = asyncHandler(async (req: Request, res: Response) => {
    if (!req.user) {
      throw new ApiError(401, 'Unauthorized');
    }

    const data = await companyService.updateProfile(getRequiredParam(req, 'companyId'), req.body, {
      userId: req.user.userId,
      role: req.user.role,
    });
    res.status(200).json(data);
  });

  public setActivation = asyncHandler(async (req: Request, res: Response) => {
    const data = await companyService.updateActivation(getRequiredParam(req, 'companyId'), req.body);
    res.status(200).json(data);
  });

  public list = asyncHandler(async (req: Request, res: Response) => {
    const data = await companyService.listCompanies(req.query as Record<string, unknown>);
    res.status(200).json(data);
  });
}

export const companyController = new CompanyController();
