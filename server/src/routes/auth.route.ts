import { Router } from 'express';

import { authController } from '../controllers/auth.controller.js';
import { validateBody } from '../middlewares/validate.middleware.js';
import { loginDtoSchema, refreshTokenDtoSchema } from '../validators/auth.validator.js';

const authRouter = Router();

authRouter.post('/login', validateBody(loginDtoSchema), authController.login);
authRouter.post('/refresh-token', validateBody(refreshTokenDtoSchema), authController.refreshToken);
authRouter.post('/logout', authController.logout);

export default authRouter;
