import Role from '../models/Role.model.js';
import User from '../models/User.model.js';
import { env } from '../config/env.js';
import { ApiError } from '../utils/api-error.js';
import { createAccessToken, createRefreshToken, verifyRefreshToken } from '../utils/token.js';
import { hashPassword, verifyPassword } from '../utils/password.js';
class AuthService {
    async ensureFixedAdmin() {
        const adminRole = await Role.findOne({ name: 'admin' }).lean();
        if (!adminRole) {
            throw new ApiError(500, 'Admin role is not configured');
        }
        const existing = await User.findOne({ email: env.ADMIN_EMAIL, isDeleted: false }).lean();
        if (!existing) {
            const hashedPassword = await hashPassword(env.ADMIN_PASSWORD);
            await User.create({
                fullName: 'Admin',
                email: env.ADMIN_EMAIL,
                password: hashedPassword,
                role: adminRole._id,
                roleName: 'admin',
                isVerified: true,
                status: 'active',
            });
        }
    }
    async login(payload) {
        await this.ensureFixedAdmin();
        const user = await User.findOne({ email: payload.email, isDeleted: false });
        if (!user) {
            throw new ApiError(401, 'Invalid email or password');
        }
        const isPasswordValid = await verifyPassword(payload.password, user.password);
        if (!isPasswordValid) {
            throw new ApiError(401, 'Invalid email or password');
        }
        if (user.status !== 'active') {
            throw new ApiError(403, 'Your account is inactive');
        }
        const jwtPayload = {
            userId: user._id.toString(),
            role: user.roleName,
        };
        const accessToken = createAccessToken(jwtPayload);
        const refreshToken = createRefreshToken(jwtPayload);
        user.refreshToken = refreshToken;
        await user.save();
        return {
            user: {
                id: user._id.toString(),
                fullName: user.fullName,
                email: user.email,
                role: user.roleName,
            },
            tokens: { accessToken, refreshToken },
        };
    }
    async logout(refreshToken) {
        if (!refreshToken) {
            return;
        }
        const decoded = verifyRefreshToken(refreshToken);
        const user = await User.findById(decoded.userId);
        if (!user) {
            return;
        }
        if (user.refreshToken !== refreshToken) {
            return;
        }
        user.refreshToken = null;
        await user.save();
    }
    async refreshAccessToken(payload) {
        const decoded = verifyRefreshToken(payload.refreshToken);
        const user = await User.findById(decoded.userId);
        if (!user || user.isDeleted || user.status !== 'active') {
            throw new ApiError(401, 'Invalid refresh token');
        }
        if (user.refreshToken !== payload.refreshToken) {
            throw new ApiError(401, 'Refresh token mismatch');
        }
        const jwtPayload = {
            userId: user._id.toString(),
            role: user.roleName,
        };
        const accessToken = createAccessToken(jwtPayload);
        const refreshToken = createRefreshToken(jwtPayload);
        user.refreshToken = refreshToken;
        await user.save();
        return { accessToken, refreshToken };
    }
}
export const authService = new AuthService();
