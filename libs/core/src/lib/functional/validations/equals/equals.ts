import { ValidationFn } from '../../types/types';
import { createValidationFn } from '../create-validation-fn';

export function equals<T>(comparisonValue: T): ValidationFn<T>;
export function equals<T>(comparisonValue: T, message: string): ValidationFn<T>;
export function equals<T>(comparisonValue: T, message?: string): ValidationFn<T> {
  return createValidationFn(value => value === comparisonValue, message || `Value must equal ${comparisonValue}`);
}
