import { ValidationError } from '../errors/validation-error';
import { ValidationFailure } from '../result/validation-failure';
import { KeyOf } from '../types/ts-helpers';
import { CascadeMode, Validation } from '../types/types';

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
export function validateKeySync<TModel extends object, Key extends KeyOf<TModel>, KeyValidation extends Validation<TModel[Key], TModel>>(
  model: TModel,
  key: Key,
  keyValidations: ReadonlyArray<KeyValidation>,
  keyCascadeMode: CascadeMode,
  throwOnFailures?: boolean
): ValidationFailure[] {
  const failures: ValidationFailure[] = [];
  for (const validation of keyValidations) {
    // check conditions - when
    const when = validation.metadata.when;
    if (when && !when(model)) {
      continue;
    }
    // check conditions - unless
    const unless = validation.metadata.unless;
    if (unless && unless(model)) {
      continue;
    }

    if (!validation(model[key])) {
      const validationFailure: ValidationFailure = {
        propertyName: key,
        message: validation.message || 'Validation failed',
        attemptedValue: model[key],
        severity: validation.metadata.severityProvider ? validation.metadata.severityProvider(model, model[key]) : 'Error'
      };
      if (throwOnFailures) {
        throw new ValidationError([validationFailure]);
      }
      failures.push(validationFailure);
      if (failures.length > 0 && keyCascadeMode === 'Stop') {
        break;
      }
    }
  }
  return failures;
}
