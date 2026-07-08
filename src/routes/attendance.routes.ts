import { Router } from 'express';
import { AttendanceController } from '../controllers';
import { AuthMiddleware, ValidationMiddleware } from '../middlewares';
import { AttendanceValidator } from '../validators';
import { AsyncHandler } from '../utils';

export class AttendanceRoutes {
  public static router = Router();
  private static controller = new AttendanceController();

  static {
    AttendanceRoutes.router.post(
      '/check-in',
      AuthMiddleware.authenticate,
      ValidationMiddleware.validate(AttendanceValidator.checkIn),
      AsyncHandler.wrap(AttendanceRoutes.controller.checkIn),
    );

    AttendanceRoutes.router.put(
      '/:id',
      AuthMiddleware.authenticate,
      ValidationMiddleware.validate(AttendanceValidator.update),
      AsyncHandler.wrap(AttendanceRoutes.controller.update),
    );

    AttendanceRoutes.router.get(
      '/employee/:employeeId',
      AuthMiddleware.authenticate,
      AsyncHandler.wrap(AttendanceRoutes.controller.getByEmployeeId),
    );

    AttendanceRoutes.router.get(
      '/reports/monthly',
      AuthMiddleware.authenticate,
      AsyncHandler.wrap(AttendanceRoutes.controller.getMonthlyReport),
    );

    AttendanceRoutes.router.delete(
      '/:id',
      AuthMiddleware.authenticate,
      AsyncHandler.wrap(AttendanceRoutes.controller.delete),
    );
  }
}
