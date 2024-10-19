import { ValidationError } from '../errors/validation-error';
import { ArrayKeyOf, KeyOf } from '../types/ts-helpers';
import { CascadeMode, isValidatorValidation, Validation } from '../types/types';
import { createValidationContext, ValidationContext } from '../validation-context';
import { failureForValidation } from './utils';

/**
 * Validates the given key synchronously.
 *
 * @param validationContext - The validation context to validate.
 * @param key - The key to validate.
 * @param keyValidations - The validations to apply.
 * @param keyCascadeMode - The cascade mode for the key.
 * @param throwOnFailures - If true, the function will throw a ValidationError if any failures occur.
 */
export function validateKeySync<
  TModel extends object,
  Key extends KeyOf<TModel> | ArrayKeyOf<TModel>,
  KeyValidation extends Validation<TModel[Key], TModel>
>(
  validationContext: ValidationContext<TModel>,
  key: Key,
  keyValidations: ReadonlyArray<KeyValidation>,
  keyCascadeMode: CascadeMode,
  throwOnFailures?: boolean
): void {
  for (const validation of keyValidations) {
    // check conditions - when
    const when = validation.metadata.when;
    if (when && !when(validationContext.modelToValidate)) {
      continue;
    }
    // check conditions - unless
    const unless = validation.metadata.unless;
    if (unless && unless(validationContext.modelToValidate)) {
      continue;
    }

    const propertyValue = validationContext.modelToValidate[key];
    if (Array.isArray(propertyValue)) {
      validateCollectionPropertySync(
        validationContext,
        key as ArrayKeyOf<TModel>,
        propertyValue as TModel[ArrayKeyOf<TModel>] & any[],
        validation,
        keyCascadeMode
      );
    } else {
      validatePropertySync(validationContext, key, propertyValue, validation);
    }

    if (validationContext.failures.length > 0 && throwOnFailures) {
      throw new ValidationError(validationContext.failures);
    }
    if (validationContext.failures.length > 0 && keyCascadeMode === 'Stop') {
      break;
    }
  }
}

function validatePropertySync<TModel extends object, Key extends KeyOf<TModel>, KeyValidation extends Validation<TModel[Key], TModel>>(
  validationContext: ValidationContext<TModel>,
  key: Key,
  propertyValue: TModel[Key],
  validation: KeyValidation
): void {
  if (isValidatorValidation(validation) && propertyValue != null && typeof propertyValue === 'object') {
    const result = validation.validator.validate(createValidationContext(propertyValue, key));
    validationContext.addFailures(...result.failures);
  }

  if (!validation(propertyValue)) {
    const failure = failureForValidation(validationContext, key, propertyValue, validation);
    validationContext.addFailures(failure);
  }
}

function validateCollectionPropertySync<
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
): void {
  for (const [index, item] of propertyValue.entries()) {
    if (isValidatorValidation(validation) && item != null && typeof item === 'object') {
      const result = validation.validator.validate(createValidationContext(item, `${key}[${index}]`));
      validationContext.addFailures(...result.failures);
      continue;
    }

    if (!validation(item)) {
      const failure = failureForValidation<TModel, TItem>(validationContext, `${key}[${index}]`, item, validation);
      validationContext.addFailures(failure);
    }
    if (validationContext.failures.length > 0 && keyCascadeMode === 'Stop') {
      break;
    }
  }
}