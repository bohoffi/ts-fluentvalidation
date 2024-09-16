import { LengthProperty } from '../../types/properties';
import { ValidationFn } from '../../types/types';
import { createValidationFn } from '../create-validation-fn';

export function length(min: number, max: number): ValidationFn<LengthProperty>;
export function length(min: number, max: number, message: string): ValidationFn<LengthProperty>;
export function length(min: number, max: number, message?: string): ValidationFn<LengthProperty> {
  return createValidationFn(
    value => (value?.length || 0) >= min && (value?.length || 0) <= max,
    message || `Value must have a length between ${min} and ${max}`
  );
}
