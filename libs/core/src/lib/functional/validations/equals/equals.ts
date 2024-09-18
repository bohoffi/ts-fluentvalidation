import { ValidationFn } from '../../types/types';
import { createValidationFn } from '../create-validation-fn';

/**
 * Creates a validation function that checks if the value is equal to the comparison value.
 *
 * @param comparisonValue - The value to compare against.
 */
export function equals<TValue, TModel>(comparisonValue: TValue): ValidationFn<TValue, TModel>;
/**
 * Creates a validation function that checks if the value is equal to the comparison value.
 *
 * @param comparisonValue - The value to compare against.
 * @param message - The message to display if the validation fails.
 */
export function equals<TValue, TModel>(comparisonValue: TValue, message: string): ValidationFn<TValue, TModel>;
export function equals<TValue, TModel>(comparisonValue: TValue, message?: string): ValidationFn<TValue, TModel> {
  return createValidationFn(value => value === comparisonValue, message || `Value must equal ${comparisonValue}.`);
}
