import type { NextFunction, Request, Response } from 'express';
import { ZodError } from 'zod';

import { ApiError } from '../utils/api-error.js';

export function errorMiddleware(error: Error, _req: Request, res: Response, _next: NextFunction): void {
  if (error instanceof ZodError) {
    res.status(400).json({ message: 'Validation failed', issues: error.flatten() });
    return;
  }

  if (error instanceof ApiError) {
    res.status(error.statusCode).json({ message: error.message });
    return;
  }

  res.status(500).json({ message: 'Internal server error' });
}
