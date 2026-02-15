import { Router } from 'express';

import { interviewController } from '../controllers/interview.controller.js';
import { authMiddleware } from '../middlewares/auth.middleware.js';
import { roleMiddleware } from '../middlewares/role.middleware.js';
import { validateBody } from '../middlewares/validate.middleware.js';
import { scheduleInterviewDtoSchema, updateInterviewStatusDtoSchema } from '../validators/interview.validator.js';

const interviewRouter = Router();

interviewRouter.use(authMiddleware);

interviewRouter.post('/', roleMiddleware('company', 'admin'), validateBody(scheduleInterviewDtoSchema), interviewController.schedule);
interviewRouter.patch('/:interviewId/status', roleMiddleware('company', 'admin'), validateBody(updateInterviewStatusDtoSchema), interviewController.updateStatus);
interviewRouter.patch('/:interviewId/cancel', roleMiddleware('company', 'admin'), interviewController.cancel);

export default interviewRouter;
