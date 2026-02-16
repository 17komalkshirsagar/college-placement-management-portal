import bcrypt from 'bcryptjs';
import { env } from '../config/env.js';
export function hashPassword(plainPassword) {
    return bcrypt.hash(plainPassword, env.BCRYPT_ROUNDS);
}
export function verifyPassword(plainPassword, hashedPassword) {
    return bcrypt.compare(plainPassword, hashedPassword);
}
