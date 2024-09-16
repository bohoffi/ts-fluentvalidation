import { ValidationFn } from '../../types/types';
import { equals } from '../equals/equals';
import { not } from '../not/not';

export function notEquals<T>(comparisonValue: T): ValidationFn<T>;
export function notEquals<T>(comparisonValue: T, message: string): ValidationFn<T>;
export function notEquals<T>(comparisonValue: T, message?: string): ValidationFn<T> {
  return not(equals(comparisonValue, message || `Value must not equal ${comparisonValue}`));
}
