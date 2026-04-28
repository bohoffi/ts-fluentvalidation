import { SyncValidation } from '../../types/validations';
import { createComparisonValidation } from '../create-comparison-validation';

/**
 * Creates a validation function that checks if the value is not equal to the comparison value.
 *
 * @param comparisonValue - The value to compare against.
 * @param message - The message to display if the validation fails.
 */
export function notEquals<TValue, TModel, TComparison extends TValue>(
  comparisonValue: TComparison,
  message?: string
): SyncValidation<TValue, TModel>;

/**
 * Creates a validation function that checks if the value is not equal to a property of the model.
 *
 * @param comparisonPredicate - A function that returns the value to compare against from the model.
 * @param message - The message to display if the validation fails.
 */
export function notEquals<TValue, TModel, TComparison extends TValue>(
  comparisonPredicate: (model: TModel) => TComparison,
  message?: string
): SyncValidation<TValue, TModel>;

export function notEquals<TValue, TModel, TComparison extends TValue>(
  comparisonValueOrPredicate: TComparison | ((model: TModel) => TComparison),
  message?: string
): SyncValidation<TValue, TModel> {
  return createComparisonValidation<TValue, TModel, TComparison>(
    (value, comp) => value !== comp,
    notEquals.name,
    comparisonValueOrPredicate,
    message
  );
}
