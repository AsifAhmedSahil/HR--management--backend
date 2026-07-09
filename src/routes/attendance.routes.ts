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
      '/',
      AuthMiddleware.authenticate,
      ValidationMiddleware.validate(AttendanceValidator.create),
      AsyncHandler.wrap(AttendanceRoutes.controller.create),
    );

    AttendanceRoutes.router.get(
      '/',
      AuthMiddleware.authenticate,
      AsyncHandler.wrap(AttendanceRoutes.controller.getAll),
    );

    AttendanceRoutes.router.get(
      '/:id',
      AuthMiddleware.authenticate,
      AsyncHandler.wrap(AttendanceRoutes.controller.getById),
    );

    AttendanceRoutes.router.put(
      '/:id',
      AuthMiddleware.authenticate,
      ValidationMiddleware.validate(AttendanceValidator.update),
      AsyncHandler.wrap(AttendanceRoutes.controller.update),
    );

    AttendanceRoutes.router.delete(
      '/:id',
      AuthMiddleware.authenticate,
      AsyncHandler.wrap(AttendanceRoutes.controller.delete),
    );
  }
}
