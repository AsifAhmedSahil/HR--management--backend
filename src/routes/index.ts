import { Router } from 'express';
import { HealthRoutes } from './health.routes';
import { AuthRoutes } from './auth.routes';
import { EmployeeRoutes } from './employee.routes';
import { AttendanceRoutes } from './attendance.routes';

const router = Router();

router.use('/health', HealthRoutes.router);
router.use('/auth', AuthRoutes.router);
router.use('/employees', EmployeeRoutes.router);
router.use('/attendance', AttendanceRoutes.router);

export { router as ApiRoutes };
