import { NumberProperty } from '../../types/properties';
import { ValidationFn } from '../../types/types';
import { createValidationFn } from '../create-validation-fn';

export function lessThanOrEquals<TModel>(comparisonValue: number): ValidationFn<NumberProperty, TModel>;
export function lessThanOrEquals<TModel>(comparisonValue: number, message: string): ValidationFn<NumberProperty, TModel>;
export function lessThanOrEquals<TModel>(comparisonValue: number, message?: string): ValidationFn<NumberProperty, TModel> {
  return createValidationFn(value => (value || 0) <= comparisonValue, message || `Value must be less than or equal to ${comparisonValue}`);
}
