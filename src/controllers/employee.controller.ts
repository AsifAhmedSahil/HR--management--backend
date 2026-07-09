import { Response, NextFunction } from 'express';
import { AuthenticatedRequest } from '../types';
import { EmployeeService } from '../services';
import { ApiResponse } from '../utils';
import { HttpStatus } from '../constants';

export class EmployeeController {
  private readonly employeeService: EmployeeService;

  constructor() {
    this.employeeService = new EmployeeService();
  }

  public create = async (req: AuthenticatedRequest, res: Response, _next: NextFunction): Promise<void> => {
    const employee = await this.employeeService.create(req.body, req.file);
    ApiResponse.success(res, employee, 'Employee created', HttpStatus.CREATED);
  };

  public getAll = async (req: AuthenticatedRequest, res: Response, _next: NextFunction): Promise<void> => {
    const page = Math.max(1, parseInt(req.query.page as string, 10) || 1);
    const limit = Math.min(100, Math.max(1, parseInt(req.query.limit as string, 10) || 10));
    const search = req.query.search as string | undefined;
    const sortBy = req.query.sortBy as string | undefined;
    const sortOrder = (req.query.sortOrder as string) === 'asc' ? 'asc' : 'desc';

    const result = await this.employeeService.getAll({
      page,
      limit,
      search,
      sortBy,
      sortOrder,
    });

    ApiResponse.success(res, result, 'Employees retrieved');
  };

  public getById = async (req: AuthenticatedRequest, res: Response, _next: NextFunction): Promise<void> => {
    const id = parseInt(req.params.id, 10);
    const employee = await this.employeeService.getById(id);
    ApiResponse.success(res, employee, 'Employee retrieved');
  };

  public update = async (req: AuthenticatedRequest, res: Response, _next: NextFunction): Promise<void> => {
    const id = parseInt(req.params.id, 10);
    const employee = await this.employeeService.update(id, req.body, req.file);
    ApiResponse.success(res, employee, 'Employee updated');
  };

  public delete = async (req: AuthenticatedRequest, res: Response, _next: NextFunction): Promise<void> => {
    const id = parseInt(req.params.id, 10);
    await this.employeeService.delete(id);
    ApiResponse.success(res, null, 'Employee deleted');
  };
}
