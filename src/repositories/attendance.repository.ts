import { Knex } from 'knex';
import { Database } from '../config';
import { IAttendance } from '../interfaces';

export class AttendanceRepository {
  private readonly db: Knex;
  private readonly tableName = 'attendance';

  constructor() {
    this.db = Database.getConnection();
  }

  public get queryBuilder(): Knex.QueryBuilder<IAttendance> {
    return this.db<IAttendance>(this.tableName);
  }

  // TODO: Implement findById
  // TODO: Implement findByEmployeeAndDate
  // TODO: Implement findAllByEmployeeId
  // TODO: Implement create
  // TODO: Implement update
  // TODO: Implement delete
  // TODO: Implement getMonthlyReport
}
