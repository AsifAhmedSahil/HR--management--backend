import { Router, Request, Response } from 'express';
import { ApiResponse } from '../utils';

export class HealthRoutes {
  public static router = Router();

  static {
    HealthRoutes.router.get('/', (_req: Request, res: Response) => {
      ApiResponse.success(res, {
        uptime: process.uptime(),
        timestamp: new Date().toISOString(),
      }, 'OK');
    });
  }
}
