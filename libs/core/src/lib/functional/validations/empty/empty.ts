import { LengthProperty } from '../../types/properties';
import { ValidationFn } from '../../types/types';
import { createValidationFn } from '../create-validation-fn';

export function empty(): ValidationFn<LengthProperty>;
export function empty(message: string): ValidationFn<LengthProperty>;
export function empty(message?: string): ValidationFn<LengthProperty> {
  return createValidationFn(value => (value?.length || 0) === 0, message || 'Value must be empty');
}
