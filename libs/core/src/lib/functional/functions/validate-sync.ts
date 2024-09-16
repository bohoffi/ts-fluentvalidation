import { ValidationFailure } from '../result/validation-failure';
import { KeyOf } from '../types/ts-helpers';
import { CascadeMode, ValidateConfig, ValidationsDictionary } from '../types/types';
import { validateKeySync } from './validate-key-sync';

/**
 * Validates the given model synchronously.
 *
 * @param model - The model to validate.
 * @param validations - The validations to apply.
 * @param validatorConfig - The configuration to apply.
 * @param keyCascadeModes - The cascade modes for the keys.
 * @returns The validation failures.
 */
export function validateSync<TModel extends object, Validations extends ValidationsDictionary<TModel>>(
  model: TModel,
  validations: Validations,
  validatorConfig: ValidateConfig<TModel>,
  keyCascadeModes: Record<KeyOf<TModel>, CascadeMode>
): ValidationFailure[] {
  const ruleEntries = validatorConfig.includeProperties
    ? Object.entries(validations).filter(([key]) => validatorConfig.includeProperties?.includes(key as KeyOf<TModel>))
    : Object.entries(validations);

  const failures: ValidationFailure[] = [];
  for (const [key, keyValidations] of ruleEntries) {
    const keyCascadeMode = keyCascadeModes[key as KeyOf<TModel>] ?? 'Continue';
    const keyFailures = validateKeySync(model, key as KeyOf<TModel>, keyValidations, keyCascadeMode, validatorConfig.throwOnFailures);
    failures.push(...keyFailures);
    if (failures.length > 0 && validatorConfig.cascadeMode === 'Stop') {
      break;
    }
  }
  return failures;
}
