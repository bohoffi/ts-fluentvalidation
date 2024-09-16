import { NumberProperty } from '../../types/properties';
import { ValidationFn } from '../../types/types';
import { createValidationFn } from '../create-validation-fn';

export function lessThan(comparisonValue: number): ValidationFn<NumberProperty>;
export function lessThan(comparisonValue: number, message: string): ValidationFn<NumberProperty>;
export function lessThan(comparisonValue: number, message?: string): ValidationFn<NumberProperty> {
  return createValidationFn(value => (value || 0) < comparisonValue, message || `Value must be less than ${comparisonValue}`);
}
