import { AppError } from './app-error';
import { HttpStatus } from '../constants';

export class UnauthorizedError extends AppError {
  constructor(message = 'Unauthorized') {
    super(message, HttpStatus.UNAUTHORIZED);
  }
}
