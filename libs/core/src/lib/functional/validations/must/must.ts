import { ValidationFn } from '../../types/types';
import { createValidationFn } from '../create-validation-fn';

/**
 * Creates a validation function that checks if the value meets the specified criteria.
 *
 * @param predicate - The predicate to check against.
 */
export function must<TValue = unknown, TModel = unknown>(predicate: (value: TValue) => boolean): ValidationFn<TValue, TModel>;
/**
 * Creates a validation function that checks if the value meets the specified criteria.
 *
 * @param predicate - The predicate to check against.
 * @param message - The message to display if the validation fails.
 */
export function must<TValue = unknown, TModel = unknown>(
  predicate: (value: TValue) => boolean,
  message: string
): ValidationFn<TValue, TModel>;
export function must<TValue = unknown, TModel = unknown>(
  predicate: (value: TValue) => boolean,
  message?: string
): ValidationFn<TValue, TModel> {
  return createValidationFn(predicate, message || 'Value must meet the specified criteria.');
}
