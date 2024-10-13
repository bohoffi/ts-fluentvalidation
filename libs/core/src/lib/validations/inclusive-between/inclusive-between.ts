import { NumberProperty } from '../../types/properties';
import { SyncValidation } from '../../types/types';
import { createValidation } from '../create-validation-fn';
import { DEFAULT_PLACEHOLDERS } from '../message-formatter';

/**
 * Creates a validation function that checks if the value is inclusively between the specified bounds.
 *
 * @param lowerBound - The lower bound.
 * @param upperBound - The upper bound.
 */
export function inclusiveBetween<TValue extends NumberProperty, TModel>(
  lowerBound: number,
  upperBound: number
): SyncValidation<TValue, TModel>;
/**
 * Creates a validation function that checks if the value is inclusively between the specified bounds.
 *
 * @param lowerBound - The lower bound.
 * @param upperBound - The upper bound.
 * @param message - The message to display if the validation fails.
 */
export function inclusiveBetween<TValue extends NumberProperty, TModel>(
  lowerBound: number,
  upperBound: number,
  message: string
): SyncValidation<TValue, TModel>;
export function inclusiveBetween<TValue extends NumberProperty, TModel>(
  lowerBound: number,
  upperBound: number,
  message?: string
): SyncValidation<TValue, TModel> {
  return createValidation<TValue, TModel>(value => (value || 0) >= lowerBound && (value || 0) <= upperBound, {
    message: message || `'{propertyName}' must be between {lowerBound} and {upperBound} inclusively.`,
    errorCode: inclusiveBetween.name
  })
    .withPlaceholder(DEFAULT_PLACEHOLDERS.lowerBound, lowerBound)
    .withPlaceholder(DEFAULT_PLACEHOLDERS.upperBound, upperBound);
}
