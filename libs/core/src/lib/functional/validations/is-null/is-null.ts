import { ValidationFn } from '../../types/types';
import { createValidationFn } from '../create-validation-fn';

export function isNull(): ValidationFn;
export function isNull(message: string): ValidationFn;
export function isNull(message?: string): ValidationFn {
  return createValidationFn(value => value === null, message || 'Value must be null.');
}
