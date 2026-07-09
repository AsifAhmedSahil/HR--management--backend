import { Knex } from 'knex';
import { Database } from '../config';
import { IAttendance } from '../interfaces';

export interface AttendanceQueryParams {
  page: number;
  limit: number;
  employee_id?: number;
  date?: string;
  from?: string;
  to?: string;
}

export interface PaginatedAttendanceResult {
  data: IAttendance[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}

export class AttendanceRepository {
  private readonly db: Knex;
  private readonly tableName = 'attendance';

  constructor() {
    this.db = Database.getConnection();
  }

  public async create(data: Partial<IAttendance>): Promise<IAttendance> {
    const [record] = await this.db<IAttendance>(this.tableName)
      .insert(data)
      .returning('*');
    return record;
  }

  public async findById(id: number): Promise<IAttendance | undefined> {
    return this.db<IAttendance>(this.tableName).where({ id }).first();
  }

  public async findByEmployeeAndDate(
    employeeId: number,
    date: string,
  ): Promise<IAttendance | undefined> {
    return this.db<IAttendance>(this.tableName)
      .where('employee_id', employeeId)
      .where('date', date)
      .first();
  }

  public async findAllWithPagination(
    params: AttendanceQueryParams,
  ): Promise<PaginatedAttendanceResult> {
    const { page, limit, employee_id, date, from, to } = params;
    const offset = (page - 1) * limit;

    const baseQuery = this.db(this.tableName);

    if (employee_id) {
      baseQuery.where({ employee_id });
    }

    if (date) {
      baseQuery.where('date', date);
    }

    if (from) {
      baseQuery.where('date', '>=', from);
    }

    if (to) {
      baseQuery.where('date', '<=', to);
    }

    const countQuery = baseQuery.clone();
    const countResult = await countQuery.count('* as count').first();
    const total = Number((countResult as Record<string, number>).count);

    const data = await baseQuery
      .orderBy('date', 'desc')
      .limit(limit)
      .offset(offset) as IAttendance[];

    return {
      data,
      total,
      page,
      limit,
      totalPages: Math.ceil(total / limit),
    };
  }

  public async update(
    id: number,
    data: Partial<IAttendance>,
  ): Promise<IAttendance | undefined> {
    const [record] = await this.db<IAttendance>(this.tableName)
      .where({ id })
      .update(data)
      .returning('*');
    return record;
  }

  public async delete(id: number): Promise<number> {
    return this.db<IAttendance>(this.tableName).where({ id }).del();
  }
}
