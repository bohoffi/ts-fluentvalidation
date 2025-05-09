import { BooleanProperty } from '../../types/properties';
import { SyncValidation } from '../../types/validations';
import { createValidation } from '../create-validation';

/**
 * Creates a validation function that checks if the value is true.
 *
 * @param message - The message to display if the validation fails.
 */
export function isTrue<TValue extends BooleanProperty, TModel>(message?: string): SyncValidation<TValue, TModel> {
  return createValidation(value => value === true, {
    message: message,
    errorCode: isTrue.name
  });
}
