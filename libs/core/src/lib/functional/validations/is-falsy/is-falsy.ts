import { ValidationFn } from '../../types/types';
import { isTruthy } from '../is-truthy/is-truthy';
import { not } from '../not/not';

/**
 * Creates a validation function that checks if the value is falsy.
 */
export function isFalsy(): ValidationFn;
/**
 * Creates a validation function that checks if the value is falsy.
 *
 * @param message - The message to display if the validation fails.
 */
export function isFalsy(message: string): ValidationFn;
export function isFalsy(message?: string): ValidationFn {
  return not(isTruthy(message || 'Value must be falsy.'));
}
