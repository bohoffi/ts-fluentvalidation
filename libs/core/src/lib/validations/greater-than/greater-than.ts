import { NumberProperty } from '../../types/properties';
import { SyncValidation } from '../../types/validations';
import { createComparisonValidation } from '../create-comparison-validation';

/**
 * Creates a validation function that checks if the value is greater than the specified value.
 *
 * @param comparisonValue - The value to compare against.
 * @param message - The message to display if the validation fails.
 */
export function greaterThan<TValue extends NumberProperty, TModel>(
  comparisonValue: number,
  message?: string
): SyncValidation<TValue, TModel>;

/**
 * Creates a validation function that checks if the value is greater than a property of the model.
 *
 * @param comparisonPredicate - A function that returns the value to compare against from the model.
 * @param message - The message to display if the validation fails.
 */
export function greaterThan<TValue extends NumberProperty, TModel>(
  comparisonPredicate: (model: TModel) => number,
  message?: string
): SyncValidation<TValue, TModel>;

export function greaterThan<TValue extends NumberProperty, TModel>(
  comparisonValueOrPredicate: number | ((model: TModel) => number),
  message?: string
): SyncValidation<TValue, TModel> {
  return createComparisonValidation<TValue, TModel, number>(
    (value, comp) => (value ?? 0) > comp,
    greaterThan.name,
    comparisonValueOrPredicate,
    message
  );
}
