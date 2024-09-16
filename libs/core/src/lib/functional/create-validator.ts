import { validateSync } from './functions/validate-sync';
import { createValidationResult, ValidationResult } from './result/validation-result';
import { EmptyObject, KeyOf } from './types/ts-helpers';
import { CascadeMode, MergedValidations, ValidateConfig, ValidationFn, ValidationsDictionary, ValidatorConfig } from './types/types';

/**
 * Represents the arguments for the `ruleFor` method. It can be either an array of validation functions or an array of validation functions followed by a cascade mode.
 */
type RuleForArgs<TModel extends object, Key extends KeyOf<TModel>> =
  | [...ValidationFn<TModel[Key]>[]]
  | [...ValidationFn<TModel[Key]>[], CascadeMode];

type Validator<TModel extends object, Validations extends ValidationsDictionary<TModel>> = {
  /**
   * The validations for the validator.
   */
  readonly validations: Validations;
  /**
   * Adds one or more validations for the given key.
   *
   * @param key - The key to validate.
   * @param validations - The validations to add optionally followed by the cascade mode for the given key.
   */
  ruleFor<Key extends KeyOf<TModel>>(
    key: Key,
    ...validations: RuleForArgs<TModel, Key>
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

  function setKeyCascadeMode<Key extends KeyOf<TModel>>(key: Key, ...validations: RuleForArgs<TModel, Key>): void {
    const keyCascadeMode: CascadeMode =
      typeof validations[validations.length - 1] === 'string' ? (validations.pop() as CascadeMode) : 'Continue';
    _keyCascadeModes[key] = keyCascadeMode;
  }

  return {
    validations: _validations,
    ruleFor<Key extends KeyOf<TModel>, KeyValidation extends ValidationFn<TModel[Key]>>(
      key: Key,
      ...validations: RuleForArgs<TModel, Key>
    ): Validator<TModel, MergedValidations<TModel, Key, Validations>> {
      setKeyCascadeMode(key, ...validations);
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
  KeyValidation extends ValidationFn<TModel[Key]>
>(
  validator: Validator<TModel, Validations>,
  key: Key,
  ...validations: KeyValidation[]
): Validator<TModel, MergedValidations<TModel, Key, Validations>> {
  const existingValidations = (validator.validations[key] ?? []) as unknown as KeyValidation[];
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  (validator.validations as any)[key] = existingValidations.concat(validations);
  return validator as Validator<TModel, MergedValidations<TModel, Key, Validations>>;
}
