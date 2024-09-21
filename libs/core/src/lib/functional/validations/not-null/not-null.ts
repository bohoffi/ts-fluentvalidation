import { SyncValidation } from '../../types/types';
import { isNull } from '../is-null/is-null';
import { not } from '../not/not';

/**
 * Creates a validation function that checks if the value is not null.
 */
export function notNull<TValue, TModel>(): SyncValidation<TValue, TModel>;
/**
 * Creates a validation function that checks if the value is not null.
 *
 * @param message - The message to display if the validation fails.
 */
export function notNull<TValue, TModel>(message: string): SyncValidation<TValue, TModel>;
export function notNull<TValue, TModel>(message?: string): SyncValidation<TValue, TModel> {
  return not(isNull(message || 'Value must not be null.'));
}
