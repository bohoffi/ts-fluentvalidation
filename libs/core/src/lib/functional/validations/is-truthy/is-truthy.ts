import { SyncValidation } from '../../types/types';
import { createValidation } from '../create-validation-fn';

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
  return createValidation(value => Boolean(value), message || 'Value must be truthy.');
}
