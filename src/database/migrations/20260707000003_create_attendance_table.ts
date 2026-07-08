import { Knex } from 'knex';

export async function up(knex: Knex): Promise<void> {
  await knex.schema.createTable('attendance', (table) => {
    table.increments('id').primary();
    table
      .integer('employee_id')
      .notNullable()
      .unsigned()
      .references('id')
      .inTable('employees')
      .onDelete('CASCADE');
    table.date('date').notNullable();
    table.timestamp('check_in_time').notNullable();
    table.timestamp('created_at').defaultTo(knex.fn.now());
    table.timestamp('updated_at').defaultTo(knex.fn.now());

    // Unique constraint on (employee_id, date) — one attendance record per employee per day
    table.unique(['employee_id', 'date']);

    // Index on employee_id and date for report query performance
    table.index(['employee_id', 'date']);
  });
}

export async function down(knex: Knex): Promise<void> {
  await knex.schema.dropTableIfExists('attendance');
}
