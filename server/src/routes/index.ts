import { Router } from 'express';

import authRouter from './auth.route.js';
import applicationRouter from './application.route.js';
import administrationCompanyRouter from './admin/company.route.js';
import companyRouter from './company.route.js';
import jobRouter from './job.route.js';
import studentRouter from './student.route.js';
import userRouter from './user.route.js';
import supportRouter from './support.route.js';

const router = Router();

router.get('/health', (_req, res) => {
  res.status(200).json({ message: 'Placement API healthy' });
});

router.use('/auth', authRouter);
router.use('/users', userRouter);
router.use('/students', studentRouter);
router.use('/companies', companyRouter);
router.use('/jobs', jobRouter);
router.use('/applications', applicationRouter);
router.use('/admin/companies', administrationCompanyRouter);
router.use('/support', supportRouter);

export default router;
