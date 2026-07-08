import { Knex } from 'knex';
import { Database } from '../config';
import { IUser } from '../interfaces';

export class UserRepository {
  private readonly db: Knex;
  private readonly tableName = 'hr_users';

  constructor() {
    this.db = Database.getConnection();
  }

  public get queryBuilder(): Knex.QueryBuilder<IUser> {
    return this.db<IUser>(this.tableName);
  }

  // TODO: Implement findById
  // TODO: Implement findByEmail
  // TODO: Implement create
  // TODO: Implement update
  // TODO: Implement delete
}
