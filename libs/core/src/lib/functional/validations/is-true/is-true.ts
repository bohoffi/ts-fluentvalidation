import { BooleanProperty } from '../../types/properties';
import { SyncValidation } from '../../types/types';
import { createValidation } from '../create-validation-fn';

/**
 * Creates a validation function that checks if the value is true.
 */
export function isTrue<TValue extends BooleanProperty, TModel>(): SyncValidation<TValue, TModel>;
/**
 * Creates a validation function that checks if the value is true.
 *
 * @param message - The message to display if the validation fails.
 */
export function isTrue<TValue extends BooleanProperty, TModel>(message: string): SyncValidation<TValue, TModel>;
export function isTrue<TValue extends BooleanProperty, TModel>(message?: string): SyncValidation<TValue, TModel> {
  return createValidation(value => value === true, {
    message: message || `'{propertyName}' must be true.`,
    errorCode: isTrue.name
  });
}
