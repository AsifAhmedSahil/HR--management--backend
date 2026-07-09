export interface IAttendance {
  id: number;
  employee_id: number;
  date: Date | string;
  check_in_time: Date;
  created_at: Date;
  updated_at: Date;
}
