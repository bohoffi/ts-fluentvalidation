import { NumberProperty } from '../../types/properties';
import { SyncValidation } from '../../types/types';
import { createValidation } from '../create-validation-fn';

/**
 * Creates a validation function that checks if the value is greater than the specified value.
 *
 * @param comparisonValue - The value to compare against.
 */
export function greaterThan<TValue extends NumberProperty, TModel>(comparisonValue: number): SyncValidation<TValue, TModel>;
/**
 * Creates a validation function that checks if the value is greater than the specified value.
 *
 * @param comparisonValue - The value to compare against.
 * @param message - The message to display if the validation fails.
 */
export function greaterThan<TValue extends NumberProperty, TModel>(
  comparisonValue: number,
  message: string
): SyncValidation<TValue, TModel>;
export function greaterThan<TValue extends NumberProperty, TModel>(
  comparisonValue: number,
  message?: string
): SyncValidation<TValue, TModel> {
  return createValidation(value => (value || 0) > comparisonValue, {
    message: message || `Value must be greater than ${comparisonValue}.`,
    errorCode: greaterThan.name
  });
}
