import { Knex } from 'knex';

export async function seed(knex: Knex): Promise<void> {
  await knex.raw('TRUNCATE TABLE attendance, employees RESTART IDENTITY CASCADE');

  await knex('employees').insert([
    {
      name: 'John Doe',
      age: 32,
      designation: 'Software Engineer',
      hiring_date: '2024-03-15',
      date_of_birth: '1994-06-20',
      salary: 75000.00,
      photo_path: null,
    },
    {
      name: 'Jane Smith',
      age: 28,
      designation: 'Product Manager',
      hiring_date: '2024-01-10',
      date_of_birth: '1998-02-14',
      salary: 85000.00,
      photo_path: null,
    },
    {
      name: 'Robert Johnson',
      age: 45,
      designation: 'Senior Architect',
      hiring_date: '2023-06-01',
      date_of_birth: '1981-11-05',
      salary: 120000.00,
      photo_path: null,
    },
    {
      name: 'Emily Davis',
      age: 35,
      designation: 'HR Manager',
      hiring_date: '2023-09-20',
      date_of_birth: '1991-04-18',
      salary: 65000.00,
      photo_path: null,
    },
    {
      name: 'Michael Wilson',
      age: 26,
      designation: 'Junior Developer',
      hiring_date: '2025-02-01',
      date_of_birth: '2000-08-30',
      salary: 55000.00,
      photo_path: null,
    },
  ]);
}
