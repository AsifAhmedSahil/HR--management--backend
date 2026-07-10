import { ReportRepository } from '../repositories';
import { IAttendanceReportItem } from '../interfaces';
import { ValidationError } from '../errors';

const MONTH_REGEX = /^\d{4}-(0[1-9]|1[0-2])$/;

export class ReportService {
  private readonly reportRepository: ReportRepository;

  constructor() {
    this.reportRepository = new ReportRepository();
  }

  public async getMonthlyAttendanceReport(
    month: string,
    employeeId?: number,
  ): Promise<IAttendanceReportItem[]> {
    if (!MONTH_REGEX.test(month)) {
      throw new ValidationError('Month must be in YYYY-MM format');
    }

    return this.reportRepository.getMonthlyAttendanceReport(month, employeeId);
  }
}
