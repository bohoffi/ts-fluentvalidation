import { BooleanProperty } from '../../types/properties';
import { ValidationFn } from '../../types/types';
import { isTrue } from '../is-true/is-true';
import { not } from '../not/not';

export function isFalse<TModel>(): ValidationFn<BooleanProperty, TModel>;
export function isFalse<TModel>(message: string): ValidationFn<BooleanProperty, TModel>;
export function isFalse<TModel>(message?: string): ValidationFn<BooleanProperty, TModel> {
  return not(isTrue(message || 'Value must be false'));
}
