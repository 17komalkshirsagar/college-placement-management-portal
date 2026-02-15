import { Router } from 'express';

import { jobController } from '../controllers/job.controller.js';
import { authMiddleware } from '../middlewares/auth.middleware.js';
import { roleMiddleware } from '../middlewares/role.middleware.js';
import { validateBody } from '../middlewares/validate.middleware.js';
import { createJobDtoSchema, updateJobDtoSchema } from '../validators/job.validator.js';

const jobRouter = Router();

jobRouter.get('/', jobController.list);

jobRouter.use(authMiddleware);

jobRouter.post('/', roleMiddleware('company'), validateBody(createJobDtoSchema), jobController.create);
jobRouter.patch('/:jobId', roleMiddleware('company', 'admin'), validateBody(updateJobDtoSchema), jobController.update);
jobRouter.patch('/:jobId/close', roleMiddleware('company', 'admin'), jobController.close);
jobRouter.delete('/:jobId', roleMiddleware('company', 'admin'), jobController.delete);

export default jobRouter;
