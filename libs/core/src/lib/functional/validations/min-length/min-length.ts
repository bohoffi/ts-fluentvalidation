import { LengthProperty } from '../../types/properties';
import { ValidationFn } from '../../types/types';
import { createValidationFn } from '../create-validation-fn';

export function minLength<TModel>(min: number): ValidationFn<LengthProperty, TModel>;
export function minLength<TModel>(min: number, message: string): ValidationFn<LengthProperty, TModel>;
export function minLength<TModel>(min: number, message?: string): ValidationFn<LengthProperty, TModel> {
  return createValidationFn(value => (value?.length || 0) >= min, message || `Value must have a minimum length of ${min}`);
}
