import { AsyncValidatorInvokedSynchronouslyError } from '../errors/async-validator-invoked-synchronously-error';
import { KeyOf } from '../types/ts-helpers';
import { ValidatorConfig } from '../types/types';
import { KeyValidations } from '../types/validations';
import { ValidationContext } from '../validation-context';
import { wrapAsArray } from './utils';
import { validateKeySync } from './validate-key-sync';

/**
 * Validates the given validation context synchronously.
 *
 * @param validationContext - The validation context to validate.
 * @param validations - The validations to apply.
 * @param validatorConfig - The configuration to apply.
 * @throws {AsyncValidatorInvokedSynchronouslyError} if the validator contains asynchronous validations or conditions but was invoked synchronously.
 */
export function validateSync<TModel extends object>(
  validationContext: ValidationContext<TModel>,
  validations: KeyValidations<TModel>[],
  validatorConfig: ValidatorConfig<TModel>
): void {
  const includedProperties = validatorConfig.includeProperties ? wrapAsArray(validatorConfig.includeProperties) : undefined;
  const validationEntries = includedProperties ? validations.filter(({ key }) => includedProperties?.includes(key)) : validations;

  if (
    validationEntries
      .flatMap(({ validations }) => validations)
      .some(validation => validation.metadata.isAsync || validation.metadata.unlessAsync || validation.metadata.whenAsync)
  ) {
    throw new AsyncValidatorInvokedSynchronouslyError();
  }

  for (const { key, validations, cascadeMode } of validationEntries) {
    const keyCascadeMode = validatorConfig.propertyCascadeMode || cascadeMode || 'Continue';
    validateKeySync(validationContext, key as KeyOf<TModel>, validations, keyCascadeMode, validatorConfig.throwOnFailures);

    if (validationContext.failures.length > 0 && validatorConfig.cascadeMode === 'Stop') {
      break;
    }
  }
}
