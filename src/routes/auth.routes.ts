import { Router } from 'express';
import { AuthController } from '../controllers';
import { AuthMiddleware } from '../middlewares';
import { ValidationMiddleware } from '../middlewares';
import { AuthValidator } from '../validators';
import { AsyncHandler } from '../utils';

export class AuthRoutes {
  public static router = Router();
  private static controller = new AuthController();

  static {
    AuthRoutes.router.post(
      '/register',
      ValidationMiddleware.validate(AuthValidator.register),
      AsyncHandler.wrap(AuthRoutes.controller.register),
    );

    AuthRoutes.router.post(
      '/login',
      ValidationMiddleware.validate(AuthValidator.login),
      AsyncHandler.wrap(AuthRoutes.controller.login),
    );

    AuthRoutes.router.get(
      '/me',
      AuthMiddleware.authenticate,
      AsyncHandler.wrap(AuthRoutes.controller.getProfile),
    );
  }
}
