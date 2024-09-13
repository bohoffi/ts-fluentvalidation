import { ValidationFn, LengthProperty } from '../../types';
import { createValidationFn } from '../../validations';

export function minLength(min: number): ValidationFn<LengthProperty>;
export function minLength(min: number, message: string): ValidationFn<LengthProperty>;
export function minLength(min: number, message?: string): ValidationFn<LengthProperty> {
  return createValidationFn(value => (value?.length || 0) >= min, message || `Value must have a minimum length of ${min}`);
}
