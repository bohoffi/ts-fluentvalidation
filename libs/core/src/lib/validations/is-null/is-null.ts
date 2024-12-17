import { SyncValidation } from '../../types/validations';
import { createValidation } from '../create-validation';

/**
 * Creates a validation function that checks if the value is null.
 *
 * @param message - The message to display if the validation fails.
 */
export function isNull<TValue, TModel>(message?: string): SyncValidation<TValue, TModel> {
  return createValidation(value => value === null, {
    message: message,
    errorCode: isNull.name
  });
}
