import { Knex } from 'knex';
import { Database } from '../config';
import { IAttendanceReportItem } from '../interfaces';

export class ReportRepository {
  private readonly db: Knex;

  constructor() {
    this.db = Database.getConnection();
  }

  public async getMonthlyAttendanceReport(
    month: string,
    employeeId?: number,
  ): Promise<IAttendanceReportItem[]> {
    const query = this.db('attendance')
      .join('employees', 'attendance.employee_id', 'employees.id')
      .whereRaw("to_char(attendance.date, 'YYYY-MM') = ?", [month])
      .select(
        'attendance.employee_id',
        'employees.name',
        this.db.raw('COUNT(attendance.id) as days_present'),
        this.db.raw(
          "COUNT(CASE WHEN attendance.check_in_time::time > '09:45:00' THEN 1 END) as times_late",
        ),
      )
      .groupBy('attendance.employee_id', 'employees.name')
      .orderBy('employees.name', 'asc');

    if (employeeId) {
      query.where('attendance.employee_id', employeeId);
    }

    return query;
  }
}
