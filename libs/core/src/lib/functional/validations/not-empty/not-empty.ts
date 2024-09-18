import { LengthProperty } from '../../types/properties';
import { ValidationFn } from '../../types/types';
import { empty } from '../empty/empty';
import { not } from '../not/not';

/**
 * Creates a validation function that checks if the value is not empty.
 */
export function notEmpty<TModel>(): ValidationFn<LengthProperty, TModel>;
/**
 * Creates a validation function that checks if the value is not empty.
 *
 * @param message - The message to display if the validation fails.
 */
export function notEmpty<TModel>(message: string): ValidationFn<LengthProperty, TModel>;
export function notEmpty<TModel>(message?: string): ValidationFn<LengthProperty, TModel> {
  return not(empty(message || 'Value must not be empty.'));
}
