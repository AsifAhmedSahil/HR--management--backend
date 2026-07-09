import { EmployeeRepository, EmployeeQueryParams, PaginatedEmployeesResult } from '../repositories';
import { IEmployee } from '../interfaces';
import { NotFoundError } from '../errors';
import { Environment } from '../config';

export class EmployeeService {
  private readonly employeeRepository: EmployeeRepository;

  constructor() {
    this.employeeRepository = new EmployeeRepository();
  }

  public async create(
    data: Omit<IEmployee, 'id' | 'created_at' | 'updated_at' | 'photo_path'>,
    photoFile?: Express.Multer.File,
  ): Promise<IEmployee> {
    const photoPath = photoFile ? `${Environment.uploadDir}/${photoFile.filename}` : null;

    const employee = await this.employeeRepository.create({
      ...data,
      photo_path: photoPath,
    });

    return employee;
  }

  public async getById(id: number): Promise<IEmployee> {
    const employee = await this.employeeRepository.findById(id);
    if (!employee) {
      throw new NotFoundError('Employee not found');
    }
    return employee;
  }

  public async getAll(params: EmployeeQueryParams): Promise<PaginatedEmployeesResult> {
    return this.employeeRepository.findAllWithPagination(params);
  }

  public async update(
    id: number,
    data: Partial<Omit<IEmployee, 'id' | 'created_at' | 'updated_at' | 'photo_path'>>,
    photoFile?: Express.Multer.File,
  ): Promise<IEmployee> {
    const existing = await this.employeeRepository.findById(id);
    if (!existing) {
      throw new NotFoundError('Employee not found');
    }

    const updateData: Partial<IEmployee> = { ...data };

    if (photoFile) {
      updateData.photo_path = `${Environment.uploadDir}/${photoFile.filename}`;
    }

    const updated = await this.employeeRepository.update(id, updateData);
    return updated!;
  }

  public async delete(id: number): Promise<void> {
    const existing = await this.employeeRepository.findById(id);
    if (!existing) {
      throw new NotFoundError('Employee not found');
    }

    await this.employeeRepository.delete(id);
  }
}
