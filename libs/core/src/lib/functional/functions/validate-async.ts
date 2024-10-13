import { KeyOf } from '../types/ts-helpers';
import { CascadeMode, ValidateConfig, Validation } from '../types/types';
import { ValidationContext } from '../validation-context';
import { wrapAsArray } from './utils';
import { validateKeyAsync } from './validate-key-async';

/**
 * Validates the given model asynchronously.
 *
 * @param validationContext - The validation context to validate.
 * @param validations - The validations to apply.
 * @param validatorConfig - The configuration to apply.
 * @param keyCascadeModes - The cascade modes for the keys.
 */
export async function validateAsync<TModel extends object, Validations extends object>(
  validationContext: ValidationContext<TModel>,
  validations: Validations,
  validatorConfig: ValidateConfig<TModel>,
  keyCascadeModes: Record<KeyOf<TModel>, CascadeMode>
): Promise<void> {
  const includedProperties = validatorConfig.includeProperties ? wrapAsArray(validatorConfig.includeProperties) : undefined;
  const ruleEntries: Array<[string, Validation<TModel[KeyOf<TModel>], TModel>[]]> = includedProperties
    ? Object.entries(validations).filter(([key]) => includedProperties?.includes(key as KeyOf<TModel>))
    : Object.entries(validations);

  for (const [key, keyValidations] of ruleEntries) {
    const keyCascadeMode = validatorConfig.propertyCascadeMode || keyCascadeModes[key as KeyOf<TModel>] || 'Continue';
    await validateKeyAsync(
      validationContext,
      key as KeyOf<TModel>,
      keyValidations as Validation<TModel[KeyOf<TModel>], TModel>[],
      keyCascadeMode,
      validatorConfig.throwOnFailures
    );

    if (validationContext.failures.length > 0 && validatorConfig.cascadeMode === 'Stop') {
      break;
    }
  }
}
