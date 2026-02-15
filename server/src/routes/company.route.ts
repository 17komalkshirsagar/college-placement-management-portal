import { Router } from 'express';

import { companyController } from '../controllers/company.controller.js';
import { authMiddleware } from '../middlewares/auth.middleware.js';
import { roleMiddleware } from '../middlewares/role.middleware.js';
import { validateBody } from '../middlewares/validate.middleware.js';
import { updateCompanyActivationDtoSchema, updateCompanyProfileDtoSchema } from '../validators/company.validator.js';

const companyRouter = Router();

companyRouter.use(authMiddleware);

companyRouter.patch('/:companyId', roleMiddleware('company', 'admin'), validateBody(updateCompanyProfileDtoSchema), companyController.update);
companyRouter.patch('/:companyId/activation', roleMiddleware('admin'), validateBody(updateCompanyActivationDtoSchema), companyController.setActivation);
companyRouter.get('/', roleMiddleware('admin'), companyController.list);

export default companyRouter;
