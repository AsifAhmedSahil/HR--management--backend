import { Router } from 'express';
import { ReportController } from '../controllers';
import { AuthMiddleware } from '../middlewares';
import { AsyncHandler } from '../utils';

export class ReportRoutes {
  public static router = Router();
  private static controller = new ReportController();

  static {
    ReportRoutes.router.get(
      '/attendance',
      AuthMiddleware.authenticate,
      AsyncHandler.wrap(ReportRoutes.controller.getAttendanceReport),
    );
  }
}
