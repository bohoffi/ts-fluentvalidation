import { NumberProperty } from '../../types/properties';
import { ValidationFn } from '../../types/types';
import { createValidationFn } from '../create-validation-fn';

export function greaterThanOrEquals<TModel>(comparisonValue: number): ValidationFn<NumberProperty, TModel>;
export function greaterThanOrEquals<TModel>(comparisonValue: number, message: string): ValidationFn<NumberProperty, TModel>;
export function greaterThanOrEquals<TModel>(comparisonValue: number, message?: string): ValidationFn<NumberProperty, TModel> {
  return createValidationFn(
    value => (value || 0) >= comparisonValue,
    message || `Value must be greater than or equal to ${comparisonValue}`
  );
}
