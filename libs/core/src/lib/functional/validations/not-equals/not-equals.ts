import { SyncValidation } from '../../types/types';
import { equals } from '../equals/equals';
import { not } from '../not/not';

/**
 * Creates a validation function that checks if the value is not equal to the comparison value.
 *
 * @param comparisonValue - The value to compare against.
 */
export function notEquals<TValue, TModel>(comparisonValue: TValue): SyncValidation<TValue, TModel>;
/**
 * Creates a validation function that checks if the value is not equal to the comparison value.
 *
 * @param comparisonValue - The value to compare against.
 * @param message - The message to display if the validation fails.
 */
export function notEquals<TValue, TModel>(comparisonValue: TValue, message: string): SyncValidation<TValue, TModel>;
export function notEquals<TValue, TModel>(comparisonValue: TValue, message?: string): SyncValidation<TValue, TModel> {
  return not(equals(comparisonValue, message || `Value must not equal ${comparisonValue}.`));
}
