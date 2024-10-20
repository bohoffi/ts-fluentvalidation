import { SyncValidation } from '../../types/validations';
import { createValidation } from '../create-validation';

/**
 * Creates a validation function that checks if the value is truthy.
 */
export function isTruthy<TValue, TModel>(): SyncValidation<TValue, TModel>;
/**
 * Creates a validation function that checks if the value is truthy.
 *
 * @param message - The message to display if the validation fails.
 */
export function isTruthy<TValue, TModel>(message: string): SyncValidation<TValue, TModel>;
export function isTruthy<TValue, TModel>(message?: string): SyncValidation<TValue, TModel> {
  return createValidation(value => Boolean(value), {
    message: message || `'{propertyName}' must be truthy.`,
    errorCode: isTruthy.name
  });
}
