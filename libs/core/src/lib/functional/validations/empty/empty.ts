import { LengthProperty } from '../../types/properties';
import { ValidationFn } from '../../types/types';
import { createValidationFn } from '../create-validation-fn';

/**
 * Creates a validation function that checks if the values length is 0.
 */
export function empty<TModel>(): ValidationFn<LengthProperty, TModel>;
/**
 * Creates a validation function that checks if the values length is 0.
 *
 * @param message - The message to display if the validation fails.
 */
export function empty<TModel>(message: string): ValidationFn<LengthProperty, TModel>;
export function empty<TModel>(message?: string): ValidationFn<LengthProperty, TModel> {
  return createValidationFn(value => (value?.length || 0) === 0, message || 'Value must be empty.');
}
