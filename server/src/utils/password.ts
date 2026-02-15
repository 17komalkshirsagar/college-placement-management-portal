import bcrypt from 'bcryptjs';

import { env } from '../config/env.js';

export function hashPassword(plainPassword: string): Promise<string> {
  return bcrypt.hash(plainPassword, env.BCRYPT_ROUNDS);
}

export function verifyPassword(plainPassword: string, hashedPassword: string): Promise<boolean> {
  return bcrypt.compare(plainPassword, hashedPassword);
}
