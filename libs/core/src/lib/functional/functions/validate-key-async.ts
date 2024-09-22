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
export async function validateKeyAsync<
  TModel extends object,
  Key extends KeyOf<TModel>,
  KeyValidation extends Validation<TModel[KeyOf<TModel>], TModel>
>(
  model: TModel,
  key: Key,
  validations: KeyValidation[],
  keyCascadeMode: CascadeMode,
  throwOnFailures?: boolean
): Promise<ValidationFailure[]> {
  const failures: ValidationFailure[] = [];
  for (const validation of validations) {
    // check conditions - when
    const when = validation.metadata.when;
    if (when && !when(model)) {
      continue;
    }
    const whenAsync = validation.metadata.whenAsync;
    if (whenAsync && !(await whenAsync(model))) {
      continue;
    }
    // check conditions - unless
    const unless = validation.metadata.unless;
    if (unless && unless(model)) {
      continue;
    }
    const unlessAsync = validation.metadata.unlessAsync;
    if (unlessAsync && (await unlessAsync(model))) {
      continue;
    }

    if (!(await validation(model[key]))) {
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
