import { LengthProperty } from '../../types/properties';
import { SyncValidation } from '../../types/types';
import { createValidation } from '../create-validation-fn';

/**
 * Creates a validation function that checks if the values length is between (inclusive) the specified minimum and maximum.
 *
 * @param minLength - The minimum length.
 * @param maxLength - The maximum length.
 */
export function length<TValue extends LengthProperty, TModel>(minLength: number, maxLength: number): SyncValidation<TValue, TModel>;
/**
 * Creates a validation function that checks if the values length is between (inclusive) the specified minimum and maximum.
 *
 * @param minLength - The minimum length.
 * @param maxLength - The maximum length.
 * @param message - The message to display if the validation fails.
 */
export function length<TValue extends LengthProperty, TModel>(
  minLength: number,
  maxLength: number,
  message: string
): SyncValidation<TValue, TModel>;
export function length<TValue extends LengthProperty, TModel>(
  minLength: number,
  maxLength: number,
  message?: string
): SyncValidation<TValue, TModel> {
  return createValidation(value => (value?.length || 0) >= minLength && (value?.length || 0) <= maxLength, {
    message: message || `Value must have a length between (inclusive) ${minLength} and ${maxLength}.`,
    errorCode: length.name
  });
}
