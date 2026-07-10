import { Knex } from 'knex';

interface AttendanceEntry {
  employee_id: number;
  date: string;
  check_in_time: Date;
}

export async function seed(knex: Knex): Promise<void> {
  await knex('attendance').del();

  const year = 2026;
  const month = 6; // July (0-indexed in JS)

  const employeeSchedules: { employee_id: number; days: number[]; lateDays: Set<number> }[] = [
    { employee_id: 1, days: [1, 2, 3, 6, 7, 8, 9, 10, 13, 14, 15, 16, 17, 20, 21, 22, 23, 24, 27, 28], lateDays: new Set([1, 8, 17, 24]) },
    { employee_id: 2, days: [1, 2, 3, 6, 7, 8, 9, 10, 13, 14, 15, 16, 17, 20, 21, 22, 23, 24, 27, 28, 29, 30], lateDays: new Set([29]) },
    { employee_id: 3, days: [1, 2, 3, 6, 7, 8, 9, 10, 13, 14, 15, 16, 17, 20, 21, 22, 23, 24, 27, 28], lateDays: new Set([2, 7, 13, 20, 22, 28]) },
    { employee_id: 4, days: [1, 2, 3, 6, 7, 8, 9, 10, 13, 14, 15, 16, 17, 20, 21, 22, 23, 24, 27, 28, 30], lateDays: new Set([6, 27]) },
    { employee_id: 5, days: [1, 2, 3, 6, 7, 8, 9, 10, 13, 14, 15, 16, 20, 21, 27], lateDays: new Set([1, 6, 10, 13, 15, 20, 21, 27]) },
  ];

  const records: AttendanceEntry[] = [];

  for (const schedule of employeeSchedules) {
    for (const day of schedule.days) {
      const date = `${year}-${String(month + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`;

      let time: string;
      if (schedule.lateDays.has(day)) {
        // Late arrivals — demonstrate various late times
        const lateTimes = ['09:46', '09:50', '10:00', '10:10', '10:30', '11:00'];
        time = lateTimes[day % lateTimes.length];
      } else if (day % 7 === 0) {
        // Exactly 09:45 — should NOT be counted as late
        time = '09:45';
      } else if (day % 5 === 0) {
        time = '09:44';
      } else if (day % 3 === 0) {
        time = '09:15';
      } else {
        time = '09:00';
      }

      records.push({
        employee_id: schedule.employee_id,
        date,
        check_in_time: new Date(`${date}T${time}:00`),
      });
    }
  }

  await knex('attendance').insert(records);
}
