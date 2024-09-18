import { LengthProperty } from '../../types/properties';
import { ValidationFn } from '../../types/types';
import { createValidationFn } from '../create-validation-fn';

/**
 * Creates a validation function that checks if the values length is greater than or equal to the specified minimum.
 *
 * @param minLength - The minimum length.
 */
export function minLength<TModel>(minLength: number): ValidationFn<LengthProperty, TModel>;
/**
 * Creates a validation function that checks if the values length is greater than or equal to the specified minimum.
 *
 * @param minLength - The minimum length.
 * @param message - The message to display if the validation fails.
 */
export function minLength<TModel>(minLength: number, message: string): ValidationFn<LengthProperty, TModel>;
export function minLength<TModel>(minLength: number, message?: string): ValidationFn<LengthProperty, TModel> {
  return createValidationFn(value => (value?.length || 0) >= minLength, message || `Value must have a minimum length of ${minLength}.`);
}
