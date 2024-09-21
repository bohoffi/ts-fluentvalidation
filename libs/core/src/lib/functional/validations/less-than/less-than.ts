import { NumberProperty } from '../../types/properties';
import { SyncValidation } from '../../types/types';
import { createValidation } from '../create-validation-fn';

/**
 * Creates a validation function that checks if the value is less than the specified value.
 *
 * @param comparisonValue - The value to compare against.
 */
export function lessThan<TModel>(comparisonValue: number): SyncValidation<NumberProperty, TModel>;
/**
 * Creates a validation function that checks if the value is less than the specified value.
 *
 * @param comparisonValue - The value to compare against.
 * @param message - The message to display if the validation fails.
 */
export function lessThan<TModel>(comparisonValue: number, message: string): SyncValidation<NumberProperty, TModel>;
export function lessThan<TModel>(comparisonValue: number, message?: string): SyncValidation<NumberProperty, TModel> {
  return createValidation(value => (value || 0) < comparisonValue, message || `Value must be less than ${comparisonValue}.`);
}
