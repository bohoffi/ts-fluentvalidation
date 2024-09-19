import { ValidationFn } from '../../types/types';
import { isNull } from '../is-null/is-null';
import { not } from '../not/not';

/**
 * Creates a validation function that checks if the value is not null.
 */
export function notNull<TValue, TModel>(): ValidationFn<TValue, TModel>;
/**
 * Creates a validation function that checks if the value is not null.
 *
 * @param message - The message to display if the validation fails.
 */
export function notNull<TValue, TModel>(message: string): ValidationFn<TValue, TModel>;
export function notNull<TValue, TModel>(message?: string): ValidationFn<TValue, TModel> {
  return not(isNull(message || 'Value must not be null.'));
}
