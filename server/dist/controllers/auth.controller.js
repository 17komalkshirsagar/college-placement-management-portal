import { authService } from '../services/auth.service.js';
import { asyncHandler } from '../utils/async-handler.js';
class AuthController {
    login = asyncHandler(async (req, res) => {
        const data = await authService.login(req.body);
        res.status(200).json(data);
    });
    refreshToken = asyncHandler(async (req, res) => {
        const data = await authService.refreshAccessToken(req.body);
        res.status(200).json(data);
    });
    logout = asyncHandler(async (req, res) => {
        const refreshToken = req.body.refreshToken;
        await authService.logout(refreshToken);
        res.status(204).send();
    });
}
export const authController = new AuthController();
