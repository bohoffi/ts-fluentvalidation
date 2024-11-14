import { KeyOf } from '../types/ts-helpers';
import { ValidatorConfig } from '../types/types';
import { KeyValidations } from '../types/validations';
import { ValidationContext } from '../validation-context';
import { wrapAsArray } from './utils';
import { validateKeyAsync } from './validate-key-async';

/**
 * Validates the given model asynchronously.
 *
 * @param validationContext - The validation context to validate.
 * @param validations - The validations to apply.
 * @param validatorConfig - The configuration to apply.
 */
export async function validateAsync<TModel extends object>(
  validationContext: ValidationContext<TModel>,
  validations: KeyValidations<TModel>[],
  validatorConfig: ValidatorConfig<TModel>
): Promise<void> {
  const includedProperties = validatorConfig.includeProperties ? wrapAsArray(validatorConfig.includeProperties) : undefined;
  const validationEntries = includedProperties ? validations.filter(({ key }) => includedProperties?.includes(key)) : validations;

  for (const { key, validations, cascadeMode } of validationEntries) {
    const keyCascadeMode = validatorConfig.propertyCascadeMode || cascadeMode || 'Continue';
    await validateKeyAsync(validationContext, key as KeyOf<TModel>, validations, keyCascadeMode, validatorConfig.throwOnFailures);

    if (validationContext.failures.length > 0 && validatorConfig.cascadeMode === 'Stop') {
      break;
    }
  }
}
