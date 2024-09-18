import { ValidationFn } from '../../types/types';
import { createValidationFn } from '../create-validation-fn';

/**
 * Creates a validation function that checks if the value is truthy.
 */
export function isTruthy(): ValidationFn;
/**
 * Creates a validation function that checks if the value is truthy.
 *
 * @param message - The message to display if the validation fails.
 */
export function isTruthy(message: string): ValidationFn;
export function isTruthy(message?: string): ValidationFn {
  return createValidationFn(value => Boolean(value), message || 'Value must be truthy.');
}
