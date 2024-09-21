import { NumberProperty } from '../../types/properties';
import { SyncValidation } from '../../types/types';
import { createValidation } from '../create-validation-fn';

/**
 * Creates a validation function that checks if the value is greater than or equal to the specified value.
 *
 * @param comparisonValue - The value to compare against.
 */
export function greaterThanOrEquals<TModel>(comparisonValue: number): SyncValidation<NumberProperty, TModel>;
/**
 * Creates a validation function that checks if the value is greater than or equal to the specified value.
 *
 * @param comparisonValue - The value to compare against.
 * @param message - The message to display if the validation fails.
 */
export function greaterThanOrEquals<TModel>(comparisonValue: number, message: string): SyncValidation<NumberProperty, TModel>;
export function greaterThanOrEquals<TModel>(comparisonValue: number, message?: string): SyncValidation<NumberProperty, TModel> {
  return createValidation(
    value => (value || 0) >= comparisonValue,
    message || `Value must be greater than or equal to ${comparisonValue}.`
  );
}
