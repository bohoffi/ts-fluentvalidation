import { ValidationError } from '../errors/validation-error';
import { ValidationFailure } from '../result/validation-failure';
import { ArrayKeyOf, KeyOf } from '../types/ts-helpers';
import { CascadeMode, Validation } from '../types/types';
import { failureForValidation } from './utils';

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
  Key extends KeyOf<TModel> | ArrayKeyOf<TModel>,
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

    const propertyValue = model[key];
    const failuresForProperty = Array.isArray(propertyValue)
      ? await validateCollectionPropertyAsync(
          model,
          key as ArrayKeyOf<TModel>,
          propertyValue as TModel[ArrayKeyOf<TModel>] & any[],
          validation,
          keyCascadeMode
        )
      : [await validatePropertyAsync(model, key, propertyValue, validation)];
    const filteredFailures = failuresForProperty.filter<ValidationFailure>(f => f !== undefined);

    if (filteredFailures.length > 0 && throwOnFailures) {
      throw new ValidationError(filteredFailures);
    }
    failures.push(...filteredFailures);
    if (failures.length > 0 && keyCascadeMode === 'Stop') {
      break;
    }
  }
  return failures;
}

async function validatePropertyAsync<
  TModel extends object,
  Key extends KeyOf<TModel>,
  KeyValidation extends Validation<TModel[Key], TModel>
>(model: TModel, key: Key, propertyValue: TModel[Key], validation: KeyValidation): Promise<ValidationFailure | undefined> {
  if (!(await validation(propertyValue))) {
    return failureForValidation(model, key, propertyValue, validation);
  }
  return undefined;
}

async function validateCollectionPropertyAsync<
  TModel extends object,
  Key extends ArrayKeyOf<TModel>,
  TProperty extends TModel[Key] & Array<any>,
  TItem extends TProperty[0],
  KeyValidation extends Validation<TItem, TModel>
>(model: TModel, key: Key, propertyValue: TProperty, validation: KeyValidation, keyCascadeMode: CascadeMode): Promise<ValidationFailure[]> {
  const failures: ValidationFailure[] = [];
  for (const [index, item] of propertyValue.entries()) {
    if (!(await validation(item))) {
      failures.push(failureForValidation<TModel, TItem>(model, `${key}[${index}]`, item, validation));
      if (failures.length > 0 && keyCascadeMode === 'Stop') {
        break;
      }
    }
  }
  return failures;
}
