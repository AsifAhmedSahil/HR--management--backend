import { Response, NextFunction } from 'express';
import { AuthenticatedRequest } from '../types';
import { AuthService } from '../services';
import { ApiResponse } from '../utils';
import { HttpStatus } from '../constants';

export class AuthController {
  private readonly authService: AuthService;

  constructor() {
    this.authService = new AuthService();
  }

  public register = async (req: AuthenticatedRequest, res: Response, _next: NextFunction): Promise<void> => {
    const { name, email, password } = req.body;
    const user = await this.authService.register({ name, email, password });
    ApiResponse.success(res, user, 'Registration successful', HttpStatus.CREATED);
  };

  public login = async (req: AuthenticatedRequest, res: Response, _next: NextFunction): Promise<void> => {
    const { email, password } = req.body;
    const result = await this.authService.login({ email, password });
    ApiResponse.success(res, result, 'Login successful');
  };

  public getProfile = async (req: AuthenticatedRequest, res: Response, _next: NextFunction): Promise<void> => {
    const userId = req.user!.id;
    const user = await this.authService.getProfile(userId);
    ApiResponse.success(res, user, 'Profile retrieved');
  };
}
