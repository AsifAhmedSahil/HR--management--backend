import { Knex } from 'knex';
import bcrypt from 'bcrypt';

export async function seed(knex: Knex): Promise<void> {
  await knex.raw('TRUNCATE TABLE attendance, employees, hr_users RESTART IDENTITY CASCADE');

  const passwordHash = await bcrypt.hash('admin123', 10);

  await knex('hr_users').insert([
    {
      name: 'Admin User',
      email: 'admin@example.com',
      password_hash: passwordHash,
    },
  ]);
}
