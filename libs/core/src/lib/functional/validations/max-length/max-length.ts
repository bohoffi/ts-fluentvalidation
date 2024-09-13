import { ValidationFn, LengthProperty } from '../../types';
import { createValidationFn } from '../../validations';

export function maxLength(max: number): ValidationFn<LengthProperty>;
export function maxLength(max: number, message: string): ValidationFn<LengthProperty>;
export function maxLength(max: number, message?: string): ValidationFn<LengthProperty> {
  return createValidationFn(value => (value?.length || 0) <= max, message || `Value must have a maximum length of ${max}`);
}
