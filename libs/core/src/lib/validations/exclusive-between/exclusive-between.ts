import { NumberProperty } from '../../types/properties';
import { SyncValidation } from '../../types/validations';
import { createValidation } from '../create-validation';
import { DEFAULT_PLACEHOLDERS } from '../message-formatter';

/**
 * Creates a validation function that checks if the value is between the specified bounds exclusively.
 *
 * @param lowerBound - The lower bound.
 * @param upperBound - The upper bound.
 * @param message - The message to display if the validation fails.
 */
export function exclusiveBetween<TValue extends NumberProperty, TModel>(
  lowerBound: number,
  upperBound: number,
  message?: string
): SyncValidation<TValue, TModel> {
  return createValidation<TValue, TModel>(value => (value ?? 0) > lowerBound && (value ?? 0) < upperBound, {
    message: message ?? `'{propertyName}' must be between {lowerBound} and {upperBound} exclusively.`,
    errorCode: exclusiveBetween.name
  })
    .withPlaceholder(DEFAULT_PLACEHOLDERS.lowerBound, lowerBound)
    .withPlaceholder(DEFAULT_PLACEHOLDERS.upperBound, upperBound);
}
