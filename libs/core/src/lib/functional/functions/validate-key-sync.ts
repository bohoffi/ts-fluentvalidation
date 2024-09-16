import { ValidationError } from '../result/validation-error';
import { ValidationFailure } from '../result/validation-failure';
import { KeyOf } from '../types/ts-helpers';
import { CascadeMode, ValidationFn } from '../types/types';

/**
 * Validates the given key synchronously.
 *
 * @param model - The model to validate.
 * @param key - The key to validate.
 * @param keyValidations - The validations to apply.
 * @param keyCascadeMode - The cascade mode for the key.
 * @param throwOnFailures - If true, the function will throw a ValidationError if any failures occur.
 * @returns The validation failures.
 */
export function validateKeySync<TModel extends object, Key extends KeyOf<TModel>, KeyValidation extends ValidationFn<TModel[Key]>>(
  model: TModel,
  key: Key,
  keyValidations: ReadonlyArray<KeyValidation>,
  keyCascadeMode: CascadeMode,
  throwOnFailures?: boolean
): ValidationFailure[] {
  const failures: ValidationFailure[] = [];
  for (const validation of keyValidations) {
    if (!validation(model[key])) {
      const validationFailure: ValidationFailure = {
        propertyName: key,
        message: validation.message || 'Validation failed',
        attemptedValue: model[key]
      };
      if (throwOnFailures) {
        throw new ValidationError(validationFailure);
      }
      failures.push(validationFailure);
      if (failures.length > 0 && keyCascadeMode === 'Stop') {
        break;
      }
    }
  }
  return failures;
}
