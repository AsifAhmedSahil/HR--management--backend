import { Response, NextFunction } from 'express';
import { AuthenticatedRequest } from '../types';
import { AuthService } from '../services';

export class AuthController {
  private readonly authService: AuthService;

  constructor() {
    this.authService = new AuthService();
  }

  // TODO: Implement register
  public register = async (_req: AuthenticatedRequest, _res: Response, _next: NextFunction): Promise<void> => {
    // Business logic will be implemented in the next phase
    _next();
  };

  // TODO: Implement login
  public login = async (_req: AuthenticatedRequest, _res: Response, _next: NextFunction): Promise<void> => {
    // Business logic will be implemented in the next phase
    _next();
  };

  // TODO: Implement getProfile
  public getProfile = async (_req: AuthenticatedRequest, _res: Response, _next: NextFunction): Promise<void> => {
    // Business logic will be implemented in the next phase
    _next();
  };
}
