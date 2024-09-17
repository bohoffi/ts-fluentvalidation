import { LengthProperty } from '../../types/properties';
import { ValidationFn } from '../../types/types';
import { createValidationFn } from '../create-validation-fn';

export function maxLength<TModel>(max: number): ValidationFn<LengthProperty, TModel>;
export function maxLength<TModel>(max: number, message: string): ValidationFn<LengthProperty, TModel>;
export function maxLength<TModel>(max: number, message?: string): ValidationFn<LengthProperty, TModel> {
  return createValidationFn(value => (value?.length || 0) <= max, message || `Value must have a maximum length of ${max}`);
}
