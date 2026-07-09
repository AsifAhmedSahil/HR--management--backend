import { Knex } from 'knex';
import { Database } from '../config';
import { IEmployee } from '../interfaces';

export interface EmployeeQueryParams {
  page: number;
  limit: number;
  search?: string;
  sortBy?: string;
  sortOrder?: 'asc' | 'desc';
}

export interface PaginatedEmployeesResult {
  data: IEmployee[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}

export class EmployeeRepository {
  private readonly db: Knex;
  private readonly tableName = 'employees';

  private readonly allowedSortFields = ['name', 'salary', 'hiring_date', 'created_at'];

  constructor() {
    this.db = Database.getConnection();
  }

  public async create(data: Partial<IEmployee>): Promise<IEmployee> {
    const [employee] = await this.db<IEmployee>(this.tableName)
      .insert(data)
      .returning('*');
    return employee;
  }

  public async findById(id: number): Promise<IEmployee | undefined> {
    return this.db<IEmployee>(this.tableName).where({ id }).first();
  }

  public async findAllWithPagination(params: EmployeeQueryParams): Promise<PaginatedEmployeesResult> {
    const { page, limit, search, sortBy, sortOrder } = params;
    const offset = (page - 1) * limit;

    const baseQuery = this.db(this.tableName);

    if (search) {
      baseQuery.where(function () {
        this.whereILike('name', `%${search}%`).orWhereILike('designation', `%${search}%`);
      });
    }

    const countQuery = baseQuery.clone();
    const countResult = await countQuery.count('* as count').first();
    const total = Number((countResult as Record<string, number>).count);

    const sortField = sortBy && this.allowedSortFields.includes(sortBy) ? sortBy : 'created_at';
    const sortDir = sortOrder === 'asc' ? 'asc' : 'desc';

    const data = await baseQuery
      .orderBy(sortField, sortDir)
      .limit(limit)
      .offset(offset) as IEmployee[];

    return {
      data,
      total,
      page,
      limit,
      totalPages: Math.ceil(total / limit),
    };
  }

  public async update(id: number, data: Partial<IEmployee>): Promise<IEmployee | undefined> {
    const [employee] = await this.db<IEmployee>(this.tableName)
      .where({ id })
      .update(data)
      .returning('*');
    return employee;
  }

  public async delete(id: number): Promise<number> {
    return this.db<IEmployee>(this.tableName).where({ id }).del();
  }
}
