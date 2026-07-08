import { Router } from 'express';
import { EmployeeController } from '../controllers';
import { AuthMiddleware, ValidationMiddleware, UploadMiddleware } from '../middlewares';
import { EmployeeValidator } from '../validators';
import { AsyncHandler } from '../utils';

export class EmployeeRoutes {
  public static router = Router();
  private static controller = new EmployeeController();

  static {
    EmployeeRoutes.router.post(
      '/',
      AuthMiddleware.authenticate,
      UploadMiddleware.single('photo'),
      ValidationMiddleware.validate(EmployeeValidator.create),
      AsyncHandler.wrap(EmployeeRoutes.controller.create),
    );

    EmployeeRoutes.router.get(
      '/',
      AuthMiddleware.authenticate,
      AsyncHandler.wrap(EmployeeRoutes.controller.getAll),
    );

    EmployeeRoutes.router.get(
      '/:id',
      AuthMiddleware.authenticate,
      AsyncHandler.wrap(EmployeeRoutes.controller.getById),
    );

    EmployeeRoutes.router.put(
      '/:id',
      AuthMiddleware.authenticate,
      UploadMiddleware.single('photo'),
      ValidationMiddleware.validate(EmployeeValidator.update),
      AsyncHandler.wrap(EmployeeRoutes.controller.update),
    );

    EmployeeRoutes.router.delete(
      '/:id',
      AuthMiddleware.authenticate,
      AsyncHandler.wrap(EmployeeRoutes.controller.delete),
    );
  }
}
