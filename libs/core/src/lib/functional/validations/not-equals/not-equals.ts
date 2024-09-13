import { ValidationFn } from '../../types';
import { not } from '../not/not';
import { equals } from '../equals/equals';

export function notEquals<T>(comparisonValue: T): ValidationFn<T>;
export function notEquals<T>(comparisonValue: T, message: string): ValidationFn<T>;
export function notEquals<T>(comparisonValue: T, message?: string): ValidationFn<T> {
  return not(equals(comparisonValue, message || `Value must not equal ${comparisonValue}`));
}
