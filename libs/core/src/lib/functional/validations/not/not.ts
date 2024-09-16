import { ValidationFn } from '../../types/types';
import { createValidationFn } from '../create-validation-fn';

export function not<T>(validationFn: ValidationFn<T>): ValidationFn<T> {
  return createValidationFn(value => !validationFn(value), validationFn.message || '');
}
