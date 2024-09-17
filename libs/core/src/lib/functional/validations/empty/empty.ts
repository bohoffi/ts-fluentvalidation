import { LengthProperty } from '../../types/properties';
import { ValidationFn } from '../../types/types';
import { createValidationFn } from '../create-validation-fn';

export function empty<TModel>(): ValidationFn<LengthProperty, TModel>;
export function empty<TModel>(message: string): ValidationFn<LengthProperty, TModel>;
export function empty<TModel>(message?: string): ValidationFn<LengthProperty, TModel> {
  return createValidationFn(value => (value?.length || 0) === 0, message || 'Value must be empty');
}
