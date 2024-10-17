import { SyncValidation } from '../../types/types';
import { createValidation } from '../create-validation';

/**
 * Creates a validation function that checks if the value meets the specified criteria.
 *
 * @param predicate - The predicate to check against.
 */
export function must<TValue, TModel = unknown>(predicate: (value: TValue) => boolean): SyncValidation<TValue, TModel>;
/**
 * Creates a validation function that checks if the value meets the specified criteria.
 *
 * @param predicate - The predicate to check against.
 * @param message - The message to display if the validation fails.
 */
export function must<TValue, TModel = unknown>(predicate: (value: TValue) => boolean, message: string): SyncValidation<TValue, TModel>;
export function must<TValue, TModel = unknown>(predicate: (value: TValue) => boolean, message?: string): SyncValidation<TValue, TModel> {
  return createValidation<TValue, TModel>(predicate, {
    message: message || `'{propertyName}' must meet the specified criteria.`,
    errorCode: must.name
  });
}
