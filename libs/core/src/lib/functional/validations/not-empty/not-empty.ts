import { LengthProperty } from '../../types/properties';
import { ValidationFn } from '../../types/types';
import { empty } from '../empty/empty';
import { not } from '../not/not';

export function notEmpty<TModel>(): ValidationFn<LengthProperty, TModel>;
export function notEmpty<TModel>(message: string): ValidationFn<LengthProperty, TModel>;
export function notEmpty<TModel>(message?: string): ValidationFn<LengthProperty, TModel> {
  return not(empty(message || 'Value must not be empty'));
}
