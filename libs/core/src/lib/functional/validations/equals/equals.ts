import { SyncValidation } from '../../types/types';
import { createValidation } from '../create-validation-fn';

/**
 * Creates a validation function that checks if the value is equal to the comparison value.
 *
 * @param comparisonValue - The value to compare against.
 */
export function equals<TValue, TModel>(comparisonValue: TValue): SyncValidation<TValue, TModel>;
/**
 * Creates a validation function that checks if the value is equal to the comparison value.
 *
 * @param comparisonValue - The value to compare against.
 * @param message - The message to display if the validation fails.
 */
export function equals<TValue, TModel>(comparisonValue: TValue, message: string): SyncValidation<TValue, TModel>;
export function equals<TValue, TModel>(comparisonValue: TValue, message?: string): SyncValidation<TValue, TModel> {
  return createValidation(value => value === comparisonValue, {
    message: message || `Value must equal ${comparisonValue}.`,
    errorCode: equals.name
  });
}
