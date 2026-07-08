import { AppError } from './app-error';
import { HttpStatus } from '../constants';

export class ValidationError extends AppError {
  public readonly errors: string[];

  constructor(message = 'Validation failed', errors: string[] = []) {
    super(message, HttpStatus.UNPROCESSABLE_ENTITY);
    this.errors = errors;
  }
}
