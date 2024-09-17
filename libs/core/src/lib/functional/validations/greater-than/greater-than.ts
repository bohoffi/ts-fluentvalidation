import { NumberProperty } from '../../types/properties';
import { ValidationFn } from '../../types/types';
import { createValidationFn } from '../create-validation-fn';

export function greaterThan<TModel>(comparisonValue: number): ValidationFn<NumberProperty, TModel>;
export function greaterThan<TModel>(comparisonValue: number, message: string): ValidationFn<NumberProperty, TModel>;
export function greaterThan<TModel>(comparisonValue: number, message?: string): ValidationFn<NumberProperty, TModel> {
  return createValidationFn(value => (value || 0) > comparisonValue, message || `Value must be greater than ${comparisonValue}`);
}
