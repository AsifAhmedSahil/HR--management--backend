import { AppError } from './app-error';
import { HttpStatus } from '../constants';

export class ConflictError extends AppError {
  constructor(message = 'Resource already exists') {
    super(message, HttpStatus.CONFLICT);
  }
}
