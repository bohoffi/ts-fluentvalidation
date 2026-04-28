import { getPropertyName } from '../functions/expression';
import { SyncValidation } from '../types/validations';
import { createValidationBase } from './create-validation';
import { DEFAULT_PLACEHOLDERS } from './message-formatter';

/**
 * Creates a comparison validation function that supports both a static comparison value and a
 * model-based predicate.
 *
 * - When a static value is provided, `comparisonValue` is stored as a placeholder immediately.
 * - When a predicate is provided, `comparisonProperty` is stored immediately and `comparisonValue`
 *   is written into the placeholders each time the validation is invoked (so it is always current
 *   and available for error-message interpolation).
 *
 * @param compareFn - The operator logic, e.g. `(value, comp) => value === comp`.
 * @param errorCode - The error code to attach to the validation (usually the function name).
 * @param comparisonValueOrPredicate - Either a static comparison value or a `(model) => value` predicate.
 * @param message - Optional custom error message.
 */
export function createComparisonValidation<TValue, TModel, TComparison>(
  compareFn: (value: TValue, comparisonValue: TComparison) => boolean,
  errorCode: string,
  comparisonValueOrPredicate: TComparison | ((model: TModel) => TComparison),
  message?: string
): SyncValidation<TValue, TModel> {
  if (typeof comparisonValueOrPredicate === 'function') {
    const predicate = comparisonValueOrPredicate as (model: TModel) => TComparison;
    const comparisonPropertyName = getPropertyName(predicate);

    const validation: SyncValidation<TValue, TModel> = createValidationBase<
      TValue,
      (value: TValue, model?: unknown) => boolean,
      TModel,
      false
    >(
      (value, model) => {
        if (model !== undefined) {
          validation.metadata.placeholders[DEFAULT_PLACEHOLDERS.comparisonValue] = predicate(model as TModel);
        }
        return compareFn(value, predicate(model as TModel));
      },
      false,
      { errorCode, message }
    ).withPlaceholder(DEFAULT_PLACEHOLDERS.comparisonProperty, comparisonPropertyName);

    return validation;
  }

  return createValidationBase<TValue, (value: TValue, model?: unknown) => boolean, TModel, false>(
    value => compareFn(value, comparisonValueOrPredicate),
    false,
    { errorCode, message }
  ).withPlaceholder(DEFAULT_PLACEHOLDERS.comparisonValue, comparisonValueOrPredicate);
}
