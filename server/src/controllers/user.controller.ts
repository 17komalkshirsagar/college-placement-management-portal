import type { Request, Response } from 'express';

import { userService } from '../services/user.service.js';
import { asyncHandler } from '../utils/async-handler.js';
import { getRequiredParam } from '../utils/request-param.js';

class UserController {
  public createStudent = asyncHandler(async (req: Request, res: Response) => {
    const data = await userService.createStudentAccount(req.body);
    res.status(201).json(data);
  });

  public createCompany = asyncHandler(async (req: Request, res: Response) => {
    const data = await userService.createCompanyAccount(req.body);
    res.status(201).json(data);
  });

  public getById = asyncHandler(async (req: Request, res: Response) => {
    const data = await userService.getUserById(getRequiredParam(req, 'userId'));
    res.status(200).json(data);
  });

  public list = asyncHandler(async (req: Request, res: Response) => {
    const data = await userService.listUsers(req.query as Record<string, unknown>);
    res.status(200).json(data);
  });

  public update = asyncHandler(async (req: Request, res: Response) => {
    const data = await userService.updateUser(getRequiredParam(req, 'userId'), req.body);
    res.status(200).json(data);
  });

  public softDelete = asyncHandler(async (req: Request, res: Response) => {
    const data = await userService.softDeleteUser(getRequiredParam(req, 'userId'));
    res.status(200).json(data);
  });
}

export const userController = new UserController();
