import { Request, Response, NextFunction } from 'express';
import { AppError } from '../errors';
import { ApiResponse } from '../utils';
import { Logger } from '../utils';
import { HttpStatus } from '../constants';

export class ErrorHandlerMiddleware {
  public static handle(err: Error, _req: Request, res: Response, _next: NextFunction): void {
    if (err instanceof AppError && err.isOperational) {
      Logger.warn(`Operational error: ${err.message}`);
      ApiResponse.error(res, err.message, err.statusCode);
      return;
    }

    Logger.error(`Unexpected error: ${err.message}`, err.stack);

    ApiResponse.error(
      res,
      'Internal server error',
      HttpStatus.INTERNAL_SERVER_ERROR,
    );
  }
}
