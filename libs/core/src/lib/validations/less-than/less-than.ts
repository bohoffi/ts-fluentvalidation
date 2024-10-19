import { NumberProperty } from '../../types/properties';
import { SyncValidation } from '../../types/validations';
import { createValidation } from '../create-validation';
import { DEFAULT_PLACEHOLDERS } from '../message-formatter';

/**
 * Creates a validation function that checks if the value is less than the specified value.
 *
 * @param comparisonValue - The value to compare against.
 */
export function lessThan<TValue extends NumberProperty, TModel>(comparisonValue: number): SyncValidation<TValue, TModel>;
/**
 * Creates a validation function that checks if the value is less than the specified value.
 *
 * @param comparisonValue - The value to compare against.
 * @param message - The message to display if the validation fails.
 */
export function lessThan<TValue extends NumberProperty, TModel>(comparisonValue: number, message: string): SyncValidation<TValue, TModel>;
export function lessThan<TValue extends NumberProperty, TModel>(comparisonValue: number, message?: string): SyncValidation<TValue, TModel> {
  return createValidation<TValue, TModel>(value => (value || 0) < comparisonValue, {
    message: message || `'{propertyName}' must be less than {comparisonValue}.`,
    errorCode: lessThan.name
  }).withPlaceholder(DEFAULT_PLACEHOLDERS.comparisonValue, comparisonValue);
}
