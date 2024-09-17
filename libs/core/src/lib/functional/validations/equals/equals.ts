import { ValidationFn } from '../../types/types';
import { createValidationFn } from '../create-validation-fn';

export function equals<TValue, TModel>(comparisonValue: TValue): ValidationFn<TValue, TModel>;
export function equals<TValue, TModel>(comparisonValue: TValue, message: string): ValidationFn<TValue, TModel>;
export function equals<TValue, TModel>(comparisonValue: TValue, message?: string): ValidationFn<TValue, TModel> {
  return createValidationFn(value => value === comparisonValue, message || `Value must equal ${comparisonValue}`);
}
