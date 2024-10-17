import { AsyncValidation } from '../../types/types';
import { createAsyncValidation } from '../create-validation';

/**
 * Creates an asynchronous validation function that checks if the value meets the specified criteria.
 *
 * @param predicate - The predicate to check against.
 */
export function mustAsync<TValue, TModel = unknown>(predicate: (value: TValue) => Promise<boolean>): AsyncValidation<TValue, TModel>;
/**
 * Creates an asynchronous validation function that checks if the value meets the specified criteria.
 *
 * @param predicate - The predicate to check against.
 * @param message - The message to display if the validation fails.
 */
export function mustAsync<TValue, TModel = unknown>(
  predicate: (value: TValue) => Promise<boolean>,
  message: string
): AsyncValidation<TValue, TModel>;
export function mustAsync<TValue, TModel = unknown>(
  predicate: (value: TValue) => Promise<boolean>,
  message?: string
): AsyncValidation<TValue, TModel> {
  return createAsyncValidation(predicate, {
    message: message || `'{propertyName}' must meet the specified criteria.`,
    errorCode: mustAsync.name
  });
}
