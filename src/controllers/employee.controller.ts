import { Response, NextFunction } from 'express';
import { AuthenticatedRequest } from '../types';
import { EmployeeService } from '../services';

export class EmployeeController {
  private readonly employeeService: EmployeeService;

  constructor() {
    this.employeeService = new EmployeeService();
  }

  // TODO: Implement create
  public create = async (_req: AuthenticatedRequest, _res: Response, _next: NextFunction): Promise<void> => {
    // Business logic will be implemented in the next phase
    _next();
  };

  // TODO: Implement getAll
  public getAll = async (_req: AuthenticatedRequest, _res: Response, _next: NextFunction): Promise<void> => {
    // Business logic will be implemented in the next phase
    _next();
  };

  // TODO: Implement getById
  public getById = async (_req: AuthenticatedRequest, _res: Response, _next: NextFunction): Promise<void> => {
    // Business logic will be implemented in the next phase
    _next();
  };

  // TODO: Implement update
  public update = async (_req: AuthenticatedRequest, _res: Response, _next: NextFunction): Promise<void> => {
    // Business logic will be implemented in the next phase
    _next();
  };

  // TODO: Implement delete
  public delete = async (_req: AuthenticatedRequest, _res: Response, _next: NextFunction): Promise<void> => {
    // Business logic will be implemented in the next phase
    _next();
  };
}
