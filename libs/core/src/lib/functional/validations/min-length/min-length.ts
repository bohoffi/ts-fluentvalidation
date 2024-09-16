import { LengthProperty } from '../../types/properties';
import { ValidationFn } from '../../types/types';
import { createValidationFn } from '../create-validation-fn';

export function minLength(min: number): ValidationFn<LengthProperty>;
export function minLength(min: number, message: string): ValidationFn<LengthProperty>;
export function minLength(min: number, message?: string): ValidationFn<LengthProperty> {
  return createValidationFn(value => (value?.length || 0) >= min, message || `Value must have a minimum length of ${min}`);
}
