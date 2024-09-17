import { ValidationFn } from '../../types/types';
import { equals } from '../equals/equals';
import { not } from '../not/not';

export function notEquals<TValue, TModel>(comparisonValue: TValue): ValidationFn<TValue, TModel>;
export function notEquals<TValue, TModel>(comparisonValue: TValue, message: string): ValidationFn<TValue, TModel>;
export function notEquals<TValue, TModel>(comparisonValue: TValue, message?: string): ValidationFn<TValue, TModel> {
  return not(equals(comparisonValue, message || `Value must not equal ${comparisonValue}`));
}
