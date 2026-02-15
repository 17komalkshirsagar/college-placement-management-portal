import { Types } from 'mongoose';

import { ApiError } from './api-error.js';

export function ensureObjectId(id: string, fieldName: string): void {
  if (!Types.ObjectId.isValid(id)) {
    throw new ApiError(400, `Invalid ${fieldName}`);
  }
}
