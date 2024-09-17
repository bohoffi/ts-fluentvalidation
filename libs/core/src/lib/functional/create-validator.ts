import { validateSync } from './functions/validate-sync';
import { createValidationResult, ValidationResult } from './result/validation-result';
import { EmptyObject, getLastElement, KeyOf } from './types/ts-helpers';
import { CascadeMode, MergedValidations, ValidateConfig, ValidationFn, ValidationsDictionary, ValidatorConfig } from './types/types';

type Validator<TModel extends object, Validations extends ValidationsDictionary<TModel>> = {
  /**
   * The validations for the validator.
   */
  readonly validations: Validations;
  /**
   * Adds one or more validations for the given key optionally preceded with the specified cascade mode.
   *
   * @param key - The key to validate.
   * @param args - Validations to add optionally preceded by the cascade mode for the given key.
   */
  ruleFor<Key extends KeyOf<TModel>>(
    key: Key,
    ...args: [CascadeMode, ...ValidationFn<TModel[Key], TModel>[]] | ValidationFn<TModel[Key], TModel>[]
  ): Validator<TModel, MergedValidations<TModel, Key, Validations>>;
  /**
   * Validates the given value against the validations.
   *
   * @param model - The model to validate.
   */
  validate(model: TModel): ValidationResult;
  /**
   * Validates the given value against the validations respecting the passed configuration.
   *
   * @param model - The model to validate.
   * @param config - The configuration to apply.
   */
  validate(model: TModel, config: (config: ValidatorConfig<TModel>) => void): ValidationResult;
  /**
   * Validates the given value against the validations and throws a ValidationError if any failures occur.
   *
   * @param model - The model to validate.
   */
  validateAndThrow(model: TModel): ValidationResult;
  /**
   * Validates the given value against the validations and throws a ValidationError if any failures occur respecting the passed configuration.
   *
   * @param model - The model to validate.
   * @param config - The configuration to apply.
   */
  validateAndThrow(model: TModel, config: (config: ValidatorConfig<TModel>) => void): ValidationResult;
};

export function createValidator<TModel extends object, Validations extends ValidationsDictionary<TModel> = EmptyObject>(): Validator<
  TModel,
  Validations
>;
export function createValidator<TModel extends object, Validations extends ValidationsDictionary<TModel> = EmptyObject>(
  config: ValidatorConfig<TModel>
): Validator<TModel, Validations>;
export function createValidator<TModel extends object, Validations extends ValidationsDictionary<TModel> = EmptyObject>(
  config?: ValidatorConfig<TModel>
): Validator<TModel, Validations> {
  const _validations = {} as Validations;
  const _keyCascadeModes = {} as Record<KeyOf<TModel>, CascadeMode>;
  const _defaultConfig: ValidateConfig<TModel> = {
    cascadeMode: 'Continue'
  };
  const validatorConfig = {
    ..._defaultConfig,
    ...(config || {})
  };

  return {
    validations: _validations,
    ruleFor<Key extends KeyOf<TModel>, KeyValidation extends ValidationFn<TModel[Key], TModel>>(
      key: Key,
      ...args: [CascadeMode, ...ValidationFn<TModel[Key], TModel>[]] | ValidationFn<TModel[Key], TModel>[]
    ): Validator<TModel, MergedValidations<TModel, Key, Validations>> {
      const cascadeMode = typeof args[0] === 'string' ? (args.shift() as CascadeMode) : undefined;
      const validations = args as KeyValidation[];
      _keyCascadeModes[key] = cascadeMode || 'Continue';
      return mergeValidations(this, key, ...(validations as KeyValidation[]));
    },
    validate(model: TModel, config?: (config: ValidatorConfig<TModel>) => void): ValidationResult {
      config?.(validatorConfig);
      return createValidationResult(validateSync(model, _validations, validatorConfig, _keyCascadeModes));
    },
    validateAndThrow(model: TModel, config?: (config: ValidatorConfig<TModel>) => void): ValidationResult {
      config?.(validatorConfig);
      return createValidationResult(
        validateSync(
          model,
          _validations,
          {
            ...validatorConfig,
            throwOnFailures: true
          },
          _keyCascadeModes
        )
      );
    }
  };
}

/**
 * Merges the given validations with the existing validations for the given key.
 *
 * @param validator - The validator to merge the validations into.
 * @param key - The key to merge the validations into.
 * @param validations - The validations to merge.
 * @returns The updated validator.
 */
function mergeValidations<
  TModel extends object,
  Key extends KeyOf<TModel>,
  Validations extends ValidationsDictionary<TModel>,
  KeyValidation extends ValidationFn<TModel[Key], TModel>
>(
  validator: Validator<TModel, Validations>,
  key: Key,
  ...validations: KeyValidation[]
): Validator<TModel, MergedValidations<TModel, Key, Validations>> {
  const existingValidations = (validator.validations[key] ?? []) as unknown as KeyValidation[];

  // the latest validation to add which contains `ApplyConditionTo === 'AllValidators'` or none which will default to 'AllValidators'
  // will aplly its condition to all preceding validators from the same `ruleFor` call
  const lastWhenValidation = getLastElement(
    validations,
    v => v.metadata.when !== undefined && v.metadata.whenApplyTo !== 'CurrentValidator'
  );
  if (lastWhenValidation) {
    const index = validations.indexOf(lastWhenValidation);
    const when = lastWhenValidation.metadata.when as ((model: TModel) => boolean) | undefined;
    if (when) {
      for (let i = 0; i < index; i++) {
        validations[i].metadata.when = when;
      }
    }
  }

  const lastUnlessValidation = getLastElement(
    validations,
    v => v.metadata.unless !== undefined && v.metadata.unlessApplyTo !== 'CurrentValidator'
  );
  if (lastUnlessValidation) {
    const index = validations.indexOf(lastUnlessValidation);
    const unless = lastUnlessValidation.metadata.unless as ((model: TModel) => boolean) | undefined;
    if (unless) {
      for (let i = 0; i < index; i++) {
        validations[i].metadata.unless = unless;
      }
    }
  }

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  (validator.validations as any)[key] = existingValidations.concat(validations);
  return validator as Validator<TModel, MergedValidations<TModel, Key, Validations>>;
}
