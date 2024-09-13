import { ValidationFn } from '../../types';
import { createValidationFn } from '../../validations';

export function isNull(): ValidationFn;
export function isNull(message: string): ValidationFn;
export function isNull(message?: string): ValidationFn {
  return createValidationFn(value => value === null, message || 'Value must be null');
}
