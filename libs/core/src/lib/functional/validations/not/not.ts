import { ValidationFn } from '../../types';
import { createValidationFn } from '../../validations';

export function not<T>(validationFn: ValidationFn<T>): ValidationFn<T> {
  return createValidationFn(value => !validationFn(value), validationFn.message);
}
