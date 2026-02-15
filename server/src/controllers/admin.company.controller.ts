import type { Request, Response } from 'express';

import { companyService } from '../services/company.service.js';
import { asyncHandler } from '../utils/async-handler.js';
import { ApiError } from '../utils/api-error.js';
import { getRequiredParam } from '../utils/request-param.js';

class AdminCompanyController {
  public getCompany = asyncHandler(async (req: Request, res: Response) => {
    const companyId = getRequiredParam(req, 'companyId');
    const data = await companyService.adminGetCompany(companyId);
    res.status(200).json(data);
  });

  public updateCompany = asyncHandler(async (req: Request, res: Response) => {
    const companyId = getRequiredParam(req, 'companyId');
    const payload = req.body;
    const data = await companyService.adminUpdateCompany(companyId, payload);
    res.status(200).json(data);
  });

  public updateStatus = asyncHandler(async (req: Request, res: Response) => {
    const companyId = getRequiredParam(req, 'companyId');
    const payload = req.body;
    const data = await companyService.adminUpdateStatus(companyId, payload);
    res.status(200).json(data);
  });

  public deleteCompany = asyncHandler(async (req: Request, res: Response) => {
    const companyId = getRequiredParam(req, 'companyId');
    const data = await companyService.adminDeleteCompany(companyId);
    res.status(200).json(data);
  });
}

export const adminCompanyController = new AdminCompanyController();
