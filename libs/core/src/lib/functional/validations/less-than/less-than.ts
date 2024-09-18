import { NumberProperty } from '../../types/properties';
import { ValidationFn } from '../../types/types';
import { createValidationFn } from '../create-validation-fn';

/**
 * Creates a validation function that checks if the value is less than the specified value.
 *
 * @param comparisonValue - The value to compare against.
 */
export function lessThan<TModel>(comparisonValue: number): ValidationFn<NumberProperty, TModel>;
/**
 * Creates a validation function that checks if the value is less than the specified value.
 *
 * @param comparisonValue - The value to compare against.
 * @param message - The message to display if the validation fails.
 */
export function lessThan<TModel>(comparisonValue: number, message: string): ValidationFn<NumberProperty, TModel>;
export function lessThan<TModel>(comparisonValue: number, message?: string): ValidationFn<NumberProperty, TModel> {
  return createValidationFn(value => (value || 0) < comparisonValue, message || `Value must be less than ${comparisonValue}.`);
}
