import { LengthProperty } from '../../types/properties';
import { SyncValidation } from '../../types/validations';
import { createValidation } from '../create-validation';

/**
 * Creates a validation function that checks if the values length is 0.
 *
 * @param message - The message to display if the validation fails.
 */
export function empty<TValue extends LengthProperty, TModel>(message?: string): SyncValidation<TValue, TModel> {
  return createValidation(value => (value?.length ?? 0) === 0, {
    message: message,
    errorCode: empty.name
  });
}
