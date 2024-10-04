import { SyncValidation } from '../../types/types';
import { createValidation } from '../create-validation-fn';

/**
 * Creates a validation function that checks if the value is null.
 */
export function isNull<TValue, TModel>(): SyncValidation<TValue, TModel>;
/**
 * Creates a validation function that checks if the value is null.
 *
 * @param message - The message to display if the validation fails.
 */
export function isNull<TValue, TModel>(message: string): SyncValidation<TValue, TModel>;
export function isNull<TValue, TModel>(message?: string): SyncValidation<TValue, TModel> {
  return createValidation(value => value === null, {
    message: message || `'{propertyName}' must be null.`,
    errorCode: isNull.name
  });
}
