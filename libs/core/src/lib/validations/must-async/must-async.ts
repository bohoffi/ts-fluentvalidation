import { AsyncValidation } from '../../types/validations';
import { createAsyncValidation } from '../create-validation';

/**
 * Creates an asynchronous validation function that checks if the value meets the specified criteria.
 *
 * @param predicate - The predicate to check against.
 * @param message - The message to display if the validation fails.
 */
export function mustAsync<TValue, TModel = unknown>(
  predicate: (value: TValue) => Promise<boolean>,
  message?: string
): AsyncValidation<TValue, TModel> {
  return createAsyncValidation(predicate, {
    message: message,
    errorCode: mustAsync.name
  });
}
