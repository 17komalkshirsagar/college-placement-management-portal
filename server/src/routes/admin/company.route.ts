import { Router } from 'express';

import { adminCompanyController } from '../../controllers/admin.company.controller.js';
import { authMiddleware } from '../../middlewares/auth.middleware.js';
import { roleMiddleware } from '../../middlewares/role.middleware.js';
import { validateBody } from '../../middlewares/validate.middleware.js';
import {
  adminUpdateCompanyDtoSchema,
  adminUpdateCompanyStatusDtoSchema,
} from '../../validators/company.validator.js';

const adminCompanyRouter = Router();

adminCompanyRouter.use(authMiddleware);
adminCompanyRouter.use(roleMiddleware('admin'));

adminCompanyRouter.get('/:companyId', adminCompanyController.getCompany);
adminCompanyRouter.put('/:companyId', validateBody(adminUpdateCompanyDtoSchema), adminCompanyController.updateCompany);
adminCompanyRouter.patch('/:companyId/status', validateBody(adminUpdateCompanyStatusDtoSchema), adminCompanyController.updateStatus);
adminCompanyRouter.delete('/:companyId', adminCompanyController.deleteCompany);

export default adminCompanyRouter;
