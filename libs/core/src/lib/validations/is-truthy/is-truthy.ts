import { SyncValidation } from '../../types/validations';
import { createValidation } from '../create-validation';

/**
 * Creates a validation function that checks if the value is truthy.
 *
 * @param message - The message to display if the validation fails.
 */
export function isTruthy<TValue, TModel>(message?: string): SyncValidation<TValue, TModel> {
  return createValidation(value => Boolean(value), {
    message: message,
    errorCode: isTruthy.name
  });
}
