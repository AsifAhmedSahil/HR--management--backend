import Joi from 'joi';

const timePattern = /^([01]\d|2[0-3]):([0-5]\d):([0-5]\d)$/;

export class AttendanceValidator {
  public static create = Joi.object({
    employee_id: Joi.number().integer().positive().required().messages({
      'number.base': 'Employee ID must be a number',
      'number.positive': 'Employee ID must be a positive number',
      'any.required': 'Employee ID is required',
    }),
    date: Joi.date().iso().required().messages({
      'date.format': 'Date must be a valid ISO date (YYYY-MM-DD)',
      'any.required': 'Date is required',
    }),
    check_in_time: Joi.string().pattern(timePattern).required().messages({
      'string.pattern.base': 'Check-in time must be in HH:mm:ss format',
      'any.required': 'Check-in time is required',
    }),
  });

  public static update = Joi.object({
    employee_id: Joi.number().integer().positive().messages({
      'number.base': 'Employee ID must be a number',
      'number.positive': 'Employee ID must be a positive number',
    }),
    date: Joi.date().iso().messages({
      'date.format': 'Date must be a valid ISO date (YYYY-MM-DD)',
    }),
    check_in_time: Joi.string().pattern(timePattern).messages({
      'string.pattern.base': 'Check-in time must be in HH:mm:ss format',
    }),
  }).min(1).messages({
    'object.min': 'At least one field must be provided for update',
  });
}
