import { LengthProperty } from '../../types/properties';
import { ValidationFn } from '../../types/types';
import { createValidationFn } from '../create-validation-fn';

export function maxLength(max: number): ValidationFn<LengthProperty>;
export function maxLength(max: number, message: string): ValidationFn<LengthProperty>;
export function maxLength(max: number, message?: string): ValidationFn<LengthProperty> {
  return createValidationFn(value => (value?.length || 0) <= max, message || `Value must have a maximum length of ${max}`);
}
