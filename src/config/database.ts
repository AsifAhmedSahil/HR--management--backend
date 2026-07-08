import knex, { Knex } from 'knex';
import { Environment } from './environment';

let db: Knex | null = null;

export class Database {
  public static getConnection(): Knex {
    if (!db) {
      db = knex({
        client: 'pg',
        connection: {
          host: Environment.dbHost,
          port: Environment.dbPort,
          database: Environment.dbName,
          user: Environment.dbUser,
          password: Environment.dbPassword,
        },
        pool: {
          min: 2,
          max: 10,
        },
      });
    }
    return db;
  }

  public static async destroy(): Promise<void> {
    if (db) {
      await db.destroy();
      db = null;
    }
  }
}
