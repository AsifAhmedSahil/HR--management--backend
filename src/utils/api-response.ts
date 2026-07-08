import { Response } from 'express';
import { IApiResponse } from '../interfaces';

export class ApiResponse {
  public static success<T>(res: Response, data: T, message = 'Success', statusCode = 200): void {
    const response: IApiResponse<T> = {
      success: true,
      message,
      data,
    };
    res.status(statusCode).json(response);
  }

  public static error(res: Response, message: string, statusCode = 500, errors: string[] = []): void {
    const response: IApiResponse = {
      success: false,
      message,
      errors,
    };
    res.status(statusCode).json(response);
  }
}
