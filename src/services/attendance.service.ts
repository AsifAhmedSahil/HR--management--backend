import { AttendanceRepository, AttendanceQueryParams, PaginatedAttendanceResult } from '../repositories';
import { EmployeeRepository } from '../repositories';
import { IAttendance } from '../interfaces';
import { NotFoundError, ConflictError } from '../errors';

interface CreateAttendanceInput {
  employee_id: number;
  date: string;
  check_in_time: string;
}

interface UpdateAttendanceInput {
  employee_id?: number;
  date?: string;
  check_in_time?: string;
}

export class AttendanceService {
  private readonly attendanceRepository: AttendanceRepository;
  private readonly employeeRepository: EmployeeRepository;

  constructor() {
    this.attendanceRepository = new AttendanceRepository();
    this.employeeRepository = new EmployeeRepository();
  }

  public async createOrUpdateAttendance(
    data: CreateAttendanceInput,
  ): Promise<{ record: IAttendance; created: boolean }> {
    const employee = await this.employeeRepository.findById(data.employee_id);
    if (!employee) {
      throw new NotFoundError('Employee not found');
    }

    const normalizedDate = AttendanceService.toDateString(data.date);

    const existing = await this.attendanceRepository.findByEmployeeAndDate(
      data.employee_id,
      normalizedDate,
    );

    if (existing) {
      const checkInTimestamp = AttendanceService.combineDateAndTime(
        normalizedDate,
        data.check_in_time,
      );

      const updated = await this.attendanceRepository.update(existing.id, {
        check_in_time: checkInTimestamp,
      });

      return { record: updated!, created: false };
    }

    const checkInTimestamp = AttendanceService.combineDateAndTime(
      normalizedDate,
      data.check_in_time,
    );

    const record = await this.attendanceRepository.create({
      employee_id: data.employee_id,
      date: normalizedDate,
      check_in_time: checkInTimestamp,
    });

    return { record, created: true };
  }

  public async getAttendance(
    params: AttendanceQueryParams,
  ): Promise<PaginatedAttendanceResult> {
    return this.attendanceRepository.findAllWithPagination(params);
  }

  public async getAttendanceById(id: number): Promise<IAttendance> {
    const record = await this.attendanceRepository.findById(id);
    if (!record) {
      throw new NotFoundError('Attendance record not found');
    }
    return record;
  }

  public async updateAttendance(
    id: number,
    data: UpdateAttendanceInput,
  ): Promise<IAttendance> {
    const existing = await this.attendanceRepository.findById(id);
    if (!existing) {
      throw new NotFoundError('Attendance record not found');
    }

    if (data.employee_id) {
      const employee = await this.employeeRepository.findById(data.employee_id);
      if (!employee) {
        throw new NotFoundError('Employee not found');
      }
    }

    const normalizedUpdateDate = data.date !== undefined
      ? AttendanceService.toDateString(data.date)
      : undefined;

    const targetEmployeeId = data.employee_id ?? existing.employee_id;
    const targetDate = normalizedUpdateDate ?? AttendanceService.toDateString(existing.date);

    if (data.employee_id || data.date) {
      const duplicate = await this.attendanceRepository.findByEmployeeAndDate(
        targetEmployeeId,
        targetDate,
      );

      if (duplicate && duplicate.id !== id) {
        throw new ConflictError(
          'An attendance record already exists for this employee on this date',
        );
      }
    }

    const updateData: Partial<IAttendance> = {};

    if (data.employee_id !== undefined) {
      updateData.employee_id = data.employee_id;
    }

    if (normalizedUpdateDate !== undefined) {
      updateData.date = normalizedUpdateDate;
    }

    if (data.check_in_time !== undefined && normalizedUpdateDate !== undefined) {
      updateData.check_in_time = AttendanceService.combineDateAndTime(
        normalizedUpdateDate,
        data.check_in_time,
      );
    } else if (data.check_in_time !== undefined) {
      updateData.check_in_time = AttendanceService.combineDateAndTime(
        AttendanceService.toDateString(existing.date),
        data.check_in_time,
      );
    }

    const updated = await this.attendanceRepository.update(id, updateData);
    return updated!;
  }

  public async deleteAttendance(id: number): Promise<void> {
    const existing = await this.attendanceRepository.findById(id);
    if (!existing) {
      throw new NotFoundError('Attendance record not found');
    }

    await this.attendanceRepository.delete(id);
  }

  private static toDateString(value: Date | string): string {
    if (typeof value === 'string') {
      return value;
    }
    const year = value.getFullYear();
    const month = String(value.getMonth() + 1).padStart(2, '0');
    const day = String(value.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
  }

  private static combineDateAndTime(dateStr: string, timeStr: string): Date {
    return new Date(`${dateStr}T${timeStr}`);
  }
}
