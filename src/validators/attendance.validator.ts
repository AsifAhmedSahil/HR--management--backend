import Joi from 'joi';

export class AttendanceValidator {
  public static checkIn = Joi.object({
    employee_id: Joi.number().integer().positive().required().messages({
      'number.base': 'Employee ID must be a number',
      'number.positive': 'Employee ID must be a positive number',
      'any.required': 'Employee ID is required',
    }),
    date: Joi.date().iso().required().messages({
      'date.format': 'Date must be a valid ISO date',
      'any.required': 'Date is required',
    }),
    check_in_time: Joi.date().iso().required().messages({
      'date.format': 'Check-in time must be a valid ISO date',
      'any.required': 'Check-in time is required',
    }),
  });

  public static update = Joi.object({
    employee_id: Joi.number().integer().positive(),
    date: Joi.date().iso(),
    check_in_time: Joi.date().iso(),
  }).min(1).messages({
    'object.min': 'At least one field must be provided for update',
  });
}
