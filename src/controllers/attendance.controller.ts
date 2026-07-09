import { Response, NextFunction } from 'express';
import { AuthenticatedRequest } from '../types';
import { AttendanceService } from '../services';
import { ApiResponse } from '../utils';
import { HttpStatus } from '../constants';

export class AttendanceController {
  private readonly attendanceService: AttendanceService;

  constructor() {
    this.attendanceService = new AttendanceService();
  }

  public create = async (req: AuthenticatedRequest, res: Response, _next: NextFunction): Promise<void> => {
    const { record, created } = await this.attendanceService.createOrUpdateAttendance(req.body);

    if (created) {
      ApiResponse.success(res, record, 'Attendance created', HttpStatus.CREATED);
    } else {
      ApiResponse.success(res, record, 'Attendance updated successfully');
    }
  };

  public getAll = async (req: AuthenticatedRequest, res: Response, _next: NextFunction): Promise<void> => {
    const page = Math.max(1, parseInt(req.query.page as string, 10) || 1);
    const limit = Math.min(100, Math.max(1, parseInt(req.query.limit as string, 10) || 10));
    const employee_id = req.query.employee_id ? parseInt(req.query.employee_id as string, 10) : undefined;
    const date = req.query.date as string | undefined;
    const from = req.query.from as string | undefined;
    const to = req.query.to as string | undefined;

    const result = await this.attendanceService.getAttendance({
      page,
      limit,
      employee_id,
      date,
      from,
      to,
    });

    ApiResponse.success(res, result, 'Attendance records retrieved');
  };

  public getById = async (req: AuthenticatedRequest, res: Response, _next: NextFunction): Promise<void> => {
    const id = parseInt(req.params.id, 10);
    const record = await this.attendanceService.getAttendanceById(id);
    ApiResponse.success(res, record, 'Attendance record retrieved');
  };

  public update = async (req: AuthenticatedRequest, res: Response, _next: NextFunction): Promise<void> => {
    const id = parseInt(req.params.id, 10);
    const record = await this.attendanceService.updateAttendance(id, req.body);
    ApiResponse.success(res, record, 'Attendance updated');
  };

  public delete = async (req: AuthenticatedRequest, res: Response, _next: NextFunction): Promise<void> => {
    const id = parseInt(req.params.id, 10);
    await this.attendanceService.deleteAttendance(id);
    ApiResponse.success(res, null, 'Attendance deleted');
  };
}
