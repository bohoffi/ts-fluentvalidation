import { LengthProperty } from '../../types/properties';
import { SyncValidation } from '../../types/types';
import { createValidation } from '../create-validation-fn';

/**
 * Creates a validation function that checks if the values length is greater than or equal to the specified minimum.
 *
 * @param minLength - The minimum length.
 */
export function minLength<TValue extends LengthProperty, TModel>(minLength: number): SyncValidation<TValue, TModel>;
/**
 * Creates a validation function that checks if the values length is greater than or equal to the specified minimum.
 *
 * @param minLength - The minimum length.
 * @param message - The message to display if the validation fails.
 */
export function minLength<TValue extends LengthProperty, TModel>(minLength: number, message: string): SyncValidation<TValue, TModel>;
export function minLength<TValue extends LengthProperty, TModel>(minLength: number, message?: string): SyncValidation<TValue, TModel> {
  return createValidation<TValue, TModel>(
    value => (value?.length || 0) >= minLength,
    message || `Value must have a minimum length of ${minLength}.`
  );
}
