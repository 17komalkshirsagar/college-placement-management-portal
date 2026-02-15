import { Router } from 'express';

import { applicationController } from '../controllers/application.controller.js';
import { authMiddleware } from '../middlewares/auth.middleware.js';
import { roleMiddleware } from '../middlewares/role.middleware.js';
import { validateBody } from '../middlewares/validate.middleware.js';
import { applyJobDtoSchema, updateApplicationStatusDtoSchema } from '../validators/application.validator.js';

const applicationRouter = Router();

applicationRouter.use(authMiddleware);

applicationRouter.post('/', roleMiddleware('student'), validateBody(applyJobDtoSchema), applicationController.apply);
applicationRouter.get('/', roleMiddleware('student', 'company', 'admin'), applicationController.list);
applicationRouter.get('/:applicationId', roleMiddleware('student', 'company', 'admin'), applicationController.getById);
applicationRouter.patch('/:applicationId/status', roleMiddleware('company', 'admin'), validateBody(updateApplicationStatusDtoSchema), applicationController.updateStatus);

export default applicationRouter;
