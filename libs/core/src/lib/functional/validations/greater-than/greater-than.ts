import { NumberProperty } from '../../types/properties';
import { SyncValidation } from '../../types/types';
import { createValidation } from '../create-validation-fn';

/**
 * Creates a validation function that checks if the value is greater than the specified value.
 *
 * @param comparisonValue - The value to compare against.
 */
export function greaterThan<TModel>(comparisonValue: number): SyncValidation<NumberProperty, TModel>;
export function greaterThan<TModel>(comparisonValue: number, message: string): SyncValidation<NumberProperty, TModel>;
export function greaterThan<TModel>(comparisonValue: number, message?: string): SyncValidation<NumberProperty, TModel> {
  return createValidation(value => (value || 0) > comparisonValue, message || `Value must be greater than ${comparisonValue}.`);
}
