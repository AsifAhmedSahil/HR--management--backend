import { Response, NextFunction } from 'express';
import { ObjectSchema } from 'joi';
import { AuthenticatedRequest } from '../types';
import { ValidationError } from '../errors';

export class ValidationMiddleware {
  public static validate(schema: ObjectSchema) {
    return (req: AuthenticatedRequest, _res: Response, next: NextFunction): void => {
      const { error } = schema.validate(req.body, {
        abortEarly: false,
        stripUnknown: true,
      });

      if (error) {
        const errors = error.details.map((detail) => detail.message);
        next(new ValidationError('Validation failed', errors));
        return;
      }

      next();
    };
  }
}
