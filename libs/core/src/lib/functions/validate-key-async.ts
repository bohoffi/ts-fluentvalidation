import { ValidationError } from '../errors/validation-error';
import { ArrayKeyOf, KeyOf } from '../types/ts-helpers';
import { CascadeMode } from '../types/types';
import { isValidatorValidation, Validation } from '../types/validations';
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
  KeyValidation extends Validation<TModel[Key], TModel>
>(
  validationContext: ValidationContext<TModel>,
  key: Key,
  validations: KeyValidation[],
  keyCascadeMode: CascadeMode,
  throwOnFailures?: boolean
): Promise<void> {
  for (const validation of validations) {
    // check conditions
    if (!validation.invokeCondition(validationContext.modelToValidate, validationContext)) {
      continue;
    }
    if (!(await validation.invokeAsyncCondition(validationContext.modelToValidate, validationContext))) {
      continue;
    }

    const propertyValue = validationContext.modelToValidate[key];
    if (Array.isArray(propertyValue)) {
      await validateCollectionPropertyAsync(
        validationContext,
        key as ArrayKeyOf<TModel>,
        propertyValue as TModel[ArrayKeyOf<TModel>][],
        validation as Validation<TModel[ArrayKeyOf<TModel>], TModel>,
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
    const result = await validation.validator.validateAsync(
      createValidationContext(propertyValue, validation.metadata.propertyNameOverride ?? key)
    );
    validationContext.addFailures(...result.failures);
    return;
  }

  if (!(await validation(propertyValue))) {
    const failure = failureForValidation(validationContext, key, propertyValue, validation);
    validationContext.addFailures(failure);
  }
}

async function validateCollectionPropertyAsync<
  TModel extends object,
  Key extends ArrayKeyOf<TModel>,
  TProperty extends TModel[Key][],
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

    if (!(await validation(item as TItem))) {
      const failure = failureForValidation<TModel, TItem>(validationContext, key, item as TItem, validation, index);
      validationContext.addFailures(failure);
    }
    if (validationContext.failures.length > 0 && keyCascadeMode === 'Stop') {
      break;
    }
  }
}
