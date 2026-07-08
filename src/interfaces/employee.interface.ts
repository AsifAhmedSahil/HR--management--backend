export interface IEmployee {
  id: number;
  name: string;
  age: number;
  designation: string;
  hiring_date: Date;
  date_of_birth: Date;
  salary: number;
  photo_path: string | null;
  created_at: Date;
  updated_at: Date;
}
