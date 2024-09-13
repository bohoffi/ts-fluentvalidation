import { ValidationFn, NumberProperty } from '../../types';
import { createValidationFn } from '../../validations';

export function greaterThan(comparisonValue: number): ValidationFn<NumberProperty>;
export function greaterThan(comparisonValue: number, message: string): ValidationFn<NumberProperty>;
export function greaterThan(comparisonValue: number, message?: string): ValidationFn<NumberProperty> {
  return createValidationFn(value => (value || 0) > comparisonValue, message || `Value must be greater than ${comparisonValue}`);
}
