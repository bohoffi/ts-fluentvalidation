import { SyncValidation } from '../../types/validations';
import { createComparisonValidation } from '../create-comparison-validation';

/**
 * Creates a validation function that checks if the value is equal to the comparison value or a property of the model.
 *
 * @param comparisonValueOrPredicate - The value to compare against, or a function that returns the value from the model.
 * @param message - The message to display if the validation fails.
 */
export function equals<TValue, TModel, TComparison extends TValue>(
  comparisonValueOrPredicate: TComparison | ((model: TModel) => TComparison),
  message?: string
): SyncValidation<TValue, TModel> {
  return createComparisonValidation<TValue, TModel, TComparison>(
    (value, comp) => value === comp,
    equals.name,
    comparisonValueOrPredicate,
    message
  );
}
