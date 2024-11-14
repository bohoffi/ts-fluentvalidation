import { SyncValidation } from '../../types/validations';
import { isTruthy } from '../is-truthy/is-truthy';
import { not } from '../not/not';

/**
 * Creates a validation function that checks if the value is falsy.
 */
export function isFalsy<TValue, TModel>(): SyncValidation<TValue, TModel>;
/**
 * Creates a validation function that checks if the value is falsy.
 *
 * @param message - The message to display if the validation fails.
 */
export function isFalsy<TValue, TModel>(message: string): SyncValidation<TValue, TModel>;
export function isFalsy<TValue, TModel>(message?: string): SyncValidation<TValue, TModel> {
  return not<TValue, TModel>(isTruthy(message || `'{propertyName}' must be falsy.`)).withErrorCode(isFalsy.name);
}
