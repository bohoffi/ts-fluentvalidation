import { ValidationError } from '../errors/validation-error';
import { ArrayKeyOf, KeyOf } from '../types/ts-helpers';
import { CascadeMode, isValidatorValidation, Validation } from '../types/types';
import { createValidationContext, ValidationContext } from '../validation-context';
import { failureForValidation } from './utils';

/**
 * Validates the given key synchronously.
 *
 * @param model - The validation context to validate.
 * @param key - The key to validate.
 * @param keyValidations - The validations to apply.
 * @param keyCascadeMode - The cascade mode for the key.
 * @param throwOnFailures - If true, the function will throw a ValidationError if any failures occur.
 */
export async function validateKeyAsync<
  TModel extends object,
  Key extends KeyOf<TModel> | ArrayKeyOf<TModel>,
  KeyValidation extends Validation<TModel[KeyOf<TModel>], TModel>
>(
  validationContext: ValidationContext<TModel>,
  key: Key,
  validations: KeyValidation[],
  keyCascadeMode: CascadeMode,
  throwOnFailures?: boolean
): Promise<void> {
  for (const validation of validations) {
    // check conditions - when
    const when = validation.metadata.when;
    if (when && !when(validationContext.modelToValidate)) {
      continue;
    }
    const whenAsync = validation.metadata.whenAsync;
    if (whenAsync && !(await whenAsync(validationContext.modelToValidate))) {
      continue;
    }
    // check conditions - unless
    const unless = validation.metadata.unless;
    if (unless && unless(validationContext.modelToValidate)) {
      continue;
    }
    const unlessAsync = validation.metadata.unlessAsync;
    if (unlessAsync && (await unlessAsync(validationContext.modelToValidate))) {
      continue;
    }

    const propertyValue = validationContext.modelToValidate[key];
    if (Array.isArray(propertyValue)) {
      await validateCollectionPropertyAsync(
        validationContext,
        key as ArrayKeyOf<TModel>,
        propertyValue as TModel[ArrayKeyOf<TModel>] & any[],
        validation,
        keyCascadeMode
      );
    } else {
      await validatePropertyAsync(validationContext, key, propertyValue, validation);
    }

    if (validationContext.failures.length > 0 && throwOnFailures) {
      throw new ValidationError(validationContext.failures);
    }

    if (validationContext.failures.length > 0 && keyCascadeMode === 'Stop') {
      break;
    }
  }
}

async function validatePropertyAsync<
  TModel extends object,
  Key extends KeyOf<TModel>,
  KeyValidation extends Validation<TModel[Key], TModel>
>(validationContext: ValidationContext<TModel>, key: Key, propertyValue: TModel[Key], validation: KeyValidation): Promise<void> {
  if (isValidatorValidation(validation) && propertyValue != null && typeof propertyValue === 'object') {
    const result = await validation.validator.validateAsync(createValidationContext(propertyValue, key));
    validationContext.addFailures(...result.failures);
  }

  if (!(await validation(propertyValue))) {
    const failure = failureForValidation(validationContext, key, propertyValue, validation);
    validationContext.addFailures(failure);
  }
}

async function validateCollectionPropertyAsync<
  TModel extends object,
  Key extends ArrayKeyOf<TModel>,
  TProperty extends TModel[Key] & Array<any>,
  TItem extends TProperty[0],
  KeyValidation extends Validation<TItem, TModel>
>(
  validationContext: ValidationContext<TModel>,
  key: Key,
  propertyValue: TProperty,
  validation: KeyValidation,
  keyCascadeMode: CascadeMode
): Promise<void> {
  for (const [index, item] of propertyValue.entries()) {
    if (isValidatorValidation(validation) && item != null && typeof item === 'object') {
      const result = await validation.validator.validateAsync(createValidationContext(item, `${key}[${index}]`));
      validationContext.addFailures(...result.failures);
      continue;
    }

    if (!(await validation(item))) {
      const failure = failureForValidation<TModel, TItem>(validationContext, `${key}[${index}]`, item, validation);
      validationContext.addFailures(failure);
    }
    if (validationContext.failures.length > 0 && keyCascadeMode === 'Stop') {
      break;
    }
  }
}
