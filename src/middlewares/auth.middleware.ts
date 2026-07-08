import { Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import { AuthenticatedRequest } from '../types';
import { IJwtPayload } from '../interfaces';
import { JwtConfig } from '../config';
import { UnauthorizedError } from '../errors';

export class AuthMiddleware {
  public static authenticate(req: AuthenticatedRequest, _res: Response, next: NextFunction): void {
    try {
      const authHeader = req.headers.authorization;

      if (!authHeader || !authHeader.startsWith('Bearer ')) {
        throw new UnauthorizedError('No token provided');
      }

      const token = authHeader.split(' ')[1];
      const decoded = jwt.verify(token, JwtConfig.secret) as IJwtPayload;

      req.user = decoded;
      next();
    } catch (error) {
      if (error instanceof UnauthorizedError) {
        next(error);
      } else {
        next(new UnauthorizedError('Invalid or expired token'));
      }
    }
  }
}
