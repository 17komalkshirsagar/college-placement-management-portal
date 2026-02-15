import type { Request } from 'express';

import { ApiError } from './api-error.js';

export function getRequiredParam(req: Request, key: string): string {
  const value = req.params[key];
  if (!value) {
    throw new ApiError(400, `Missing required route parameter: ${key}`);
  }

  return value;
}
