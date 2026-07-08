import { Knex } from 'knex';
import { Database } from '../config';
import { IEmployee } from '../interfaces';

export class EmployeeRepository {
  private readonly db: Knex;
  private readonly tableName = 'employees';

  constructor() {
    this.db = Database.getConnection();
  }

  public get queryBuilder(): Knex.QueryBuilder<IEmployee> {
    return this.db<IEmployee>(this.tableName);
  }

  // TODO: Implement findById
  // TODO: Implement findAll
  // TODO: Implement create
  // TODO: Implement update
  // TODO: Implement delete
  // TODO: Implement findWithPagination
}
