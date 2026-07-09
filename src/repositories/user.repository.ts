import { Knex } from 'knex';
import { Database } from '../config';
import { IUser } from '../interfaces';

export class UserRepository {
  private readonly db: Knex;
  private readonly tableName = 'hr_users';

  constructor() {
    this.db = Database.getConnection();
  }

  public async findById(id: number): Promise<IUser | undefined> {
    return this.db<IUser>(this.tableName).where({ id }).first();
  }

  public async findByEmail(email: string): Promise<IUser | undefined> {
    return this.db<IUser>(this.tableName).where({ email }).first();
  }

  public async create(data: Partial<IUser>): Promise<IUser> {
    const [user] = await this.db<IUser>(this.tableName)
      .insert(data)
      .returning('*');
    return user;
  }
}
