import jwt from 'jsonwebtoken';
import { env } from '../config/env.js';
export function createAccessToken(payload) {
    return jwt.sign(payload, env.JWT_SECRET, { expiresIn: '15m' });
}
export function createRefreshToken(payload) {
    return jwt.sign(payload, env.JWT_REFRESH_SECRET, { expiresIn: '7d' });
}
export function verifyAccessToken(token) {
    return jwt.verify(token, env.JWT_SECRET);
}
export function verifyRefreshToken(token) {
    return jwt.verify(token, env.JWT_REFRESH_SECRET);
}
