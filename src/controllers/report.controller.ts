import { Response, NextFunction } from 'express';
import { AuthenticatedRequest } from '../types';
import { ReportService } from '../services';
import { ApiResponse } from '../utils';

export class ReportController {
  private readonly reportService: ReportService;

  constructor() {
    this.reportService = new ReportService();
  }

  public getAttendanceReport = async (
    req: AuthenticatedRequest,
    res: Response,
    _next: NextFunction,
  ): Promise<void> => {
    const month = req.query.month as string;
    const employeeId = req.query.employee_id
      ? parseInt(req.query.employee_id as string, 10)
      : undefined;

    const report = await this.reportService.getMonthlyAttendanceReport(month, employeeId);
    ApiResponse.success(res, report, 'Attendance report generated');
  };
}
