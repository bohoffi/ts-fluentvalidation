import { StringProperty } from '../../types/properties';
import { ValidationFn } from '../../types/types';
import { createValidationFn } from '../create-validation-fn';

export function matches(pattern: RegExp): ValidationFn<StringProperty>;
export function matches(pattern: RegExp, message: string): ValidationFn<StringProperty>;
export function matches(pattern: RegExp, message?: string): ValidationFn<StringProperty> {
  return createValidationFn(value => pattern.test(value || ''), message || 'Value must match pattern');
}
