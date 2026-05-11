import { NumberProperty } from '../../types/properties';
import { SyncValidation } from '../../types/validations';
import { createComparisonValidation } from '../create-comparison-validation';

/**
 * Creates a validation function that checks if the value is less than the specified value or a property of the model.
 *
 * @param comparisonValueOrPredicate - The value to compare against, or a function that returns the value from the model.
 * @param message - The message to display if the validation fails.
 */
export function lessThan<TValue extends NumberProperty, TModel>(
  comparisonValueOrPredicate: number | ((model: TModel) => number),
  message?: string
): SyncValidation<TValue, TModel> {
  return createComparisonValidation<TValue, TModel, number>(
    (value, comp) => (value ?? 0) < comp,
    lessThan.name,
    comparisonValueOrPredicate,
    message
  );
}
