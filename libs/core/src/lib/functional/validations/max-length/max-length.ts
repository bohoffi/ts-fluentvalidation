import { LengthProperty } from '../../types/properties';
import { ValidationFn } from '../../types/types';
import { createValidationFn } from '../create-validation-fn';

/**
 * Creates a validation function that checks if the values length is less than or equal to the specified maximum.
 *
 * @param maxLength - The maximum length.
 */
export function maxLength<TModel>(maxLength: number): ValidationFn<LengthProperty, TModel>;
/**
 * Creates a validation function that checks if the values length is less than or equal to the specified maximum.
 *
 * @param maxLength - The maximum length.
 * @param message - The message to display if the validation fails.
 */
export function maxLength<TModel>(maxLength: number, message: string): ValidationFn<LengthProperty, TModel>;
export function maxLength<TModel>(maxLength: number, message?: string): ValidationFn<LengthProperty, TModel> {
  return createValidationFn(value => (value?.length || 0) <= maxLength, message || `Value must have a maximum length of ${maxLength}.`);
}
