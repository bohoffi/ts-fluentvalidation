import { BooleanProperty } from '../../types/properties';
import { ValidationFn } from '../../types/types';
import { createValidationFn } from '../create-validation-fn';

export function isTrue<TModel>(): ValidationFn<BooleanProperty, TModel>;
export function isTrue<TModel>(message: string): ValidationFn<BooleanProperty, TModel>;
export function isTrue<TModel>(message?: string): ValidationFn<BooleanProperty, TModel> {
  return createValidationFn(value => value === true, message || 'Value must be true');
}
