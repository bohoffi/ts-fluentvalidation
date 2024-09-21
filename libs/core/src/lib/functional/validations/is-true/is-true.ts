import { BooleanProperty } from '../../types/properties';
import { SyncValidation } from '../../types/types';
import { createValidation } from '../create-validation-fn';

/**
 * Creates a validation function that checks if the value is true.
 */
export function isTrue<TModel>(): SyncValidation<BooleanProperty, TModel>;
/**
 * Creates a validation function that checks if the value is true.
 *
 * @param message - The message to display if the validation fails.
 */
export function isTrue<TModel>(message: string): SyncValidation<BooleanProperty, TModel>;
export function isTrue<TModel>(message?: string): SyncValidation<BooleanProperty, TModel> {
  return createValidation(value => value === true, message || 'Value must be true.');
}
