import { NumberProperty } from '../../types/properties';
import { ValidationFn } from '../../types/types';
import { createValidationFn } from '../create-validation-fn';

export function lessThan<TModel>(comparisonValue: number): ValidationFn<NumberProperty, TModel>;
export function lessThan<TModel>(comparisonValue: number, message: string): ValidationFn<NumberProperty, TModel>;
export function lessThan<TModel>(comparisonValue: number, message?: string): ValidationFn<NumberProperty, TModel> {
  return createValidationFn(value => (value || 0) < comparisonValue, message || `Value must be less than ${comparisonValue}`);
}
