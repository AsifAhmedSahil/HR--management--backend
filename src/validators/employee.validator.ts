import Joi from 'joi';

export class EmployeeValidator {
  public static create = Joi.object({
    name: Joi.string().trim().min(2).max(100).required().messages({
      'string.empty': 'Name is required',
      'string.min': 'Name must be at least 2 characters',
      'string.max': 'Name must not exceed 100 characters',
    }),
    age: Joi.number().integer().min(18).max(65).required().messages({
      'number.base': 'Age must be a number',
      'number.min': 'Age must be at least 18',
      'number.max': 'Age must not exceed 65',
      'any.required': 'Age is required',
    }),
    designation: Joi.string().trim().min(2).max(100).required().messages({
      'string.empty': 'Designation is required',
      'string.min': 'Designation must be at least 2 characters',
      'string.max': 'Designation must not exceed 100 characters',
    }),
    hiring_date: Joi.date().iso().required().messages({
      'date.format': 'Hiring date must be a valid ISO date',
      'any.required': 'Hiring date is required',
    }),
    date_of_birth: Joi.date().iso().required().messages({
      'date.format': 'Date of birth must be a valid ISO date',
      'any.required': 'Date of birth is required',
    }),
    salary: Joi.number().positive().precision(2).required().messages({
      'number.base': 'Salary must be a number',
      'number.positive': 'Salary must be a positive number',
      'any.required': 'Salary is required',
    }),
  });

  public static update = Joi.object({
    name: Joi.string().trim().min(2).max(100),
    age: Joi.number().integer().min(18).max(65),
    designation: Joi.string().trim().min(2).max(100),
    hiring_date: Joi.date().iso(),
    date_of_birth: Joi.date().iso(),
    salary: Joi.number().positive().precision(2),
  }).min(1).messages({
    'object.min': 'At least one field must be provided for update',
  });
}
