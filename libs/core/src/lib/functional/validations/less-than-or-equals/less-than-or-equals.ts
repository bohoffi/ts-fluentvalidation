import { ValidationFn, NumberProperty } from '../../types';
import { createValidationFn } from '../../validations';

export function lessThanOrEquals(comparisonValue: number): ValidationFn<NumberProperty>;
export function lessThanOrEquals(comparisonValue: number, message: string): ValidationFn<NumberProperty>;
export function lessThanOrEquals(comparisonValue: number, message?: string): ValidationFn<NumberProperty> {
  return createValidationFn(value => (value || 0) <= comparisonValue, message || `Value must be less than or equal to ${comparisonValue}`);
}
