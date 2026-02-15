import type { NextFunction, Request, Response } from 'express';

import type { UserRole } from '../types/auth.types.js';
import { ApiError } from '../utils/api-error.js';

export function roleMiddleware(...roles: UserRole[]) {
  return (req: Request, _res: Response, next: NextFunction): void => {
    if (!req.user || !roles.includes(req.user.role)) {
      throw new ApiError(403, 'Forbidden');
    }

    next();
  };
}
