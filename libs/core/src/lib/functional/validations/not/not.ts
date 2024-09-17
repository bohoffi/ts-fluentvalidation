import { ValidationFn } from '../../types/types';
import { createValidationFn } from '../create-validation-fn';

export function not<TValue = unknown, TModel = unknown>(validationFn: ValidationFn<TValue, TModel>): ValidationFn<TValue, TModel> {
  return createValidationFn(value => !validationFn(value), validationFn.message || '');
}
