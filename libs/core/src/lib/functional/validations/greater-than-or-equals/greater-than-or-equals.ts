import { NumberProperty } from '../../types/properties';
import { ValidationFn } from '../../types/types';
import { createValidationFn } from '../create-validation-fn';

/**
 * Creates a validation function that checks if the value is greater than or equal to the specified value.
 *
 * @param comparisonValue - The value to compare against.
 */
export function greaterThanOrEquals<TModel>(comparisonValue: number): ValidationFn<NumberProperty, TModel>;
/**
 * Creates a validation function that checks if the value is greater than or equal to the specified value.
 *
 * @param comparisonValue - The value to compare against.
 * @param message - The message to display if the validation fails.
 */
export function greaterThanOrEquals<TModel>(comparisonValue: number, message: string): ValidationFn<NumberProperty, TModel>;
export function greaterThanOrEquals<TModel>(comparisonValue: number, message?: string): ValidationFn<NumberProperty, TModel> {
  return createValidationFn(
    value => (value || 0) >= comparisonValue,
    message || `Value must be greater than or equal to ${comparisonValue}.`
  );
}
