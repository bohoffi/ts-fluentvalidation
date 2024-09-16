import { NumberProperty } from '../../types/properties';
import { ValidationFn } from '../../types/types';
import { createValidationFn } from '../create-validation-fn';

export function greaterThan(comparisonValue: number): ValidationFn<NumberProperty>;
export function greaterThan(comparisonValue: number, message: string): ValidationFn<NumberProperty>;
export function greaterThan(comparisonValue: number, message?: string): ValidationFn<NumberProperty> {
  return createValidationFn(value => (value || 0) > comparisonValue, message || `Value must be greater than ${comparisonValue}`);
}
