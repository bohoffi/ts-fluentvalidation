import { ValidationFn, StringProperty } from '../../types';
import { createValidationFn } from '../../validations';

export function matches(pattern: RegExp): ValidationFn<StringProperty>;
export function matches(pattern: RegExp, message: string): ValidationFn<StringProperty>;
export function matches(pattern: RegExp, message?: string): ValidationFn<StringProperty> {
  return createValidationFn(value => pattern.test(value || ''), message || 'Value must match pattern');
}
