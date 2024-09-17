import { LengthProperty } from '../../types/properties';
import { ValidationFn } from '../../types/types';
import { createValidationFn } from '../create-validation-fn';

export function length<TModel>(min: number, max: number): ValidationFn<LengthProperty, TModel>;
export function length<TModel>(min: number, max: number, message: string): ValidationFn<LengthProperty, TModel>;
export function length<TModel>(min: number, max: number, message?: string): ValidationFn<LengthProperty, TModel> {
  return createValidationFn(
    value => (value?.length || 0) >= min && (value?.length || 0) <= max,
    message || `Value must have a length between ${min} and ${max}`
  );
}
