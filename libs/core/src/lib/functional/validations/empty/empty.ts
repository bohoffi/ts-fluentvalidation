import { LengthProperty, ValidationFn } from '../../types';
import { createValidationFn } from '../../validations';

export function empty(): ValidationFn<LengthProperty>;
export function empty(message: string): ValidationFn<LengthProperty>;
export function empty(message?: string): ValidationFn<LengthProperty> {
  return createValidationFn(value => (value?.length || 0) === 0, message || 'Value must be empty');
}
