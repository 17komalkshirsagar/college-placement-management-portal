import { Router } from 'express';

import { userController } from '../controllers/user.controller.js';
import { authMiddleware } from '../middlewares/auth.middleware.js';
import { roleMiddleware } from '../middlewares/role.middleware.js';
import { validateBody } from '../middlewares/validate.middleware.js';
import {
  createCompanyAccountDtoSchema,
  createStudentAccountDtoSchema,
  updateUserDtoSchema,
} from '../validators/user.validator.js';

const userRouter = Router();

userRouter.use(authMiddleware);
userRouter.use(roleMiddleware('admin'));

userRouter.post('/students', validateBody(createStudentAccountDtoSchema), userController.createStudent);
userRouter.post('/companies', validateBody(createCompanyAccountDtoSchema), userController.createCompany);
userRouter.get('/', userController.list);
userRouter.get('/:userId', userController.getById);
userRouter.patch('/:userId', validateBody(updateUserDtoSchema), userController.update);
userRouter.delete('/:userId', userController.softDelete);

export default userRouter;
