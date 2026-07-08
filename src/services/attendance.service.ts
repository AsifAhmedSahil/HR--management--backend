import { AttendanceRepository } from '../repositories';
import { EmployeeRepository } from '../repositories';

export class AttendanceService {
  private readonly attendanceRepository: AttendanceRepository;
  private readonly employeeRepository: EmployeeRepository;

  constructor() {
    this.attendanceRepository = new AttendanceRepository();
    this.employeeRepository = new EmployeeRepository();
  }

  // TODO: Implement checkIn
  // TODO: Implement update
  // TODO: Implement getByEmployeeId
  // TODO: Implement getMonthlyReport
  // TODO: Implement delete
}
