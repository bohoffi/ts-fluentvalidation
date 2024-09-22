import { NumberProperty } from '../../types/properties';
import { SyncValidation } from '../../types/types';
import { createValidation } from '../create-validation-fn';

/**
 * Creates a validation function that checks if the value is between the specified bounds exclusively.
 *
 * @param lowerBound - The lower bound.
 * @param upperBound - The upper bound.
 */
export function exclusiveBetween<TValue extends NumberProperty, TModel>(
  lowerBound: number,
  upperBound: number
): SyncValidation<TValue, TModel>;
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
  message: string
): SyncValidation<TValue, TModel>;
export function exclusiveBetween<TValue extends NumberProperty, TModel>(
  lowerBound: number,
  upperBound: number,
  message?: string
): SyncValidation<TValue, TModel> {
  return createValidation(
    value => (value || 0) > lowerBound && (value || 0) < upperBound,
    message || `Value must be between ${lowerBound} and ${upperBound} exclusively.`
  );
}
