import { AppError } from './app-error';
import { HttpStatus } from '../constants';

export class NotFoundError extends AppError {
  constructor(message = 'Resource not found') {
    super(message, HttpStatus.NOT_FOUND);
  }
}
