import { ValidationFn, LengthProperty } from '../../types';
import { createValidationFn } from '../../validations';

export function length(min: number, max: number): ValidationFn<LengthProperty>;
export function length(min: number, max: number, message: string): ValidationFn<LengthProperty>;
export function length(min: number, max: number, message?: string): ValidationFn<LengthProperty> {
  return createValidationFn(
    value => (value?.length || 0) >= min && (value?.length || 0) <= max,
    message || `Value must have a length between ${min} and ${max}`
  );
}
