import type { Request, Response } from 'express';

import { authService } from '../services/auth.service.js';
import { asyncHandler } from '../utils/async-handler.js';

class AuthController {
  public login = asyncHandler(async (req: Request, res: Response) => {
    const data = await authService.login(req.body);
    res.status(200).json(data);
  });

  public refreshToken = asyncHandler(async (req: Request, res: Response) => {
    const data = await authService.refreshAccessToken(req.body);
    res.status(200).json(data);
  });

  public logout = asyncHandler(async (req: Request, res: Response) => {
    const refreshToken = req.body.refreshToken;
    await authService.logout(refreshToken);
    res.status(204).send();
  });
}

export const authController = new AuthController();
