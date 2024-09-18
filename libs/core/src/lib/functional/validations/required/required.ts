import { isLengthProperty } from '../../types/properties';
import { ValidationFn } from '../../types/types';
import { createValidationFn } from '../create-validation-fn';

/**
 * Creates a validation function that checks if the value is neither nullish nor empty.
 */
export function required(): ValidationFn;
/**
 * Creates a validation function that checks if the value is neither nullish nor empty.
 *
 * @param message - The message to display if the validation fails.
 */
export function required(message: string): ValidationFn;
export function required(message?: string): ValidationFn {
  return createValidationFn(value => !isEmptyValue(value), message || 'Value is required.');
}

function isEmptyValue(value: unknown): boolean {
  return value == null || (isLengthProperty(value) && value.length === 0);
}
