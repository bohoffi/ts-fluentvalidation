import { BooleanProperty } from '../../types/properties';
import { ValidationFn } from '../../types/types';
import { createValidationFn } from '../create-validation-fn';

/**
 * Creates a validation function that checks if the value is true.
 */
export function isTrue<TModel>(): ValidationFn<BooleanProperty, TModel>;
/**
 * Creates a validation function that checks if the value is true.
 *
 * @param message - The message to display if the validation fails.
 */
export function isTrue<TModel>(message: string): ValidationFn<BooleanProperty, TModel>;
export function isTrue<TModel>(message?: string): ValidationFn<BooleanProperty, TModel> {
  return createValidationFn(value => value === true, message || 'Value must be true.');
}
