import type { NextFunction, Request, Response } from 'express';

import User from '../models/User.model.js';
import { ApiError } from '../utils/api-error.js';
import { verifyAccessToken } from '../utils/token.js';

export async function authMiddleware(req: Request, _res: Response, next: NextFunction): Promise<void> {
  const authorizationHeader = req.headers.authorization;
  if (!authorizationHeader?.startsWith('Bearer ')) {
    throw new ApiError(401, 'Access token is missing');
  }

  const token = authorizationHeader.replace('Bearer ', '');
  const payload = verifyAccessToken(token);

  const user = await User.findById(payload.userId).select('status isDeleted').lean();
  if (!user || user.isDeleted || user.status !== 'active') {
    throw new ApiError(401, 'Account is not authorized');
  }

  req.user = payload;
  next();
}
