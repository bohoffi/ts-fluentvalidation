import { validateAsync } from './functions/validate-async';
import { validateSync } from './functions/validate-sync';
import { createValidationResult, ValidationResult } from './result/validation-result';
import { ArrayKeyOf, EmptyObject, getLastElement, KeyOf } from './types/ts-helpers';
import { CascadeMode, InferValidations, ValidateConfig, Validation, Validator, ValidatorConfig } from './types/types';

/**
 * Creates a new validator.
 */
export function createValidator<TModel extends object, ModelValidations extends object = EmptyObject>(): Validator<
  TModel,
  ModelValidations
>;
/**
 * Creates a new validator with the given configuration.
 *
 * @param config - The configuration for the validator.
 */
export function createValidator<TModel extends object, ModelValidations extends object = EmptyObject>(
  config: ValidatorConfig<TModel>
): Validator<TModel, ModelValidations>;
export function createValidator<TModel extends object, ModelValidations extends object = EmptyObject>(
  config?: ValidatorConfig<TModel>
): Validator<TModel, ModelValidations> {
  const _validations = {} as ModelValidations;
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

    ruleFor<Key extends KeyOf<TModel>>(
      key: Key,
      ...args: [CascadeMode, ...Validation<TModel[Key], TModel>[]] | Validation<TModel[Key], TModel>[]
    ): Validator<TModel, ModelValidations & { [P in Key]: Validation<TModel[Key], TModel>[] }> {
      const cascadeMode = typeof args[0] === 'string' ? (args.shift() as CascadeMode) : undefined;
      const validations = args as Validation<TModel[Key], TModel>[];
      _keyCascadeModes[key] = cascadeMode || validatorConfig.propertyCascadeMode || 'Continue';
      return mergeValidations(this, key, true, ...(validations as Validation<TModel[Key], TModel>[]));
    },

    ruleForEach<Key extends ArrayKeyOf<TModel>, TItem extends TModel[Key] extends Array<infer Item> ? Item : never>(
      key: Key,
      ...args: [CascadeMode, ...Validation<TItem, TModel>[]] | Validation<TItem, TModel>[]
    ): Validator<TModel, ModelValidations & { [P in Key]: Validation<TItem, TModel>[] }> {
      const cascadeMode = typeof args[0] === 'string' ? (args.shift() as CascadeMode) : undefined;
      const validations = args as Validation<TItem, TModel>[];
      _keyCascadeModes[key] = cascadeMode || validatorConfig.propertyCascadeMode || 'Continue';
      return mergeValidations(this, key, true, ...(validations as Validation<TItem, TModel>[]));
    },

    include<TIncludeModel extends TModel, IncludeValidations extends object = InferValidations<Validator<TIncludeModel>>>(
      validator: Validator<TIncludeModel, IncludeValidations>
    ): Validator<TModel & TIncludeModel, ModelValidations & IncludeValidations> {
      Object.entries(validator.validations).forEach(([key, validations]) =>
        mergeValidations(this, key as KeyOf<TModel>, false, ...(validations as Validation<TModel[KeyOf<TModel>], TModel>[]))
      );

      return this as unknown as Validator<TModel & TIncludeModel, ModelValidations & IncludeValidations>;
    },

    validate(model: TModel, config?: (config: ValidatorConfig<TModel>) => void): ValidationResult {
      config?.(validatorConfig);
      return createValidationResult(validateSync(model, _validations, validatorConfig, _keyCascadeModes));
    },

    async validateAsync(model: TModel, config?: (config: ValidatorConfig<TModel>) => void): Promise<ValidationResult> {
      config?.(validatorConfig);
      return createValidationResult(await validateAsync(model, _validations, validatorConfig, _keyCascadeModes));
    },

    validateAndThrow(model: TModel): ValidationResult {
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
    },

    async validateAndThrowAsync(model: TModel): Promise<ValidationResult> {
      return createValidationResult(
        await validateAsync(
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
 * @template TModel - The type of the model being validated.
 * @template Key - The key of the model property being validated.
 * @template TValue - The type of the value being validated.
 * @template ModelValidations - The type of the model validations.
 * @param validator - The validator to merge the validations into.
 * @param key - The key to merge the validations into.
 * @param applyConditions - Flag indicating if conditions should be applied to preceding validations.
 * @param validations - The validations to merge.
 * @returns The updated validator.
 */
function mergeValidations<TModel extends object, Key extends KeyOf<TModel> | ArrayKeyOf<TModel>, TValue, ModelValidations extends object>(
  validator: Validator<TModel, ModelValidations>,
  key: Key,
  applyConditions: boolean,
  ...validations: Validation<TValue, TModel>[]
): Validator<TModel, ModelValidations & { [P in Key]: Validation<TValue, TModel>[] }> {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const existingValidations = ((validator.validations as any)[key] ?? []) as unknown as Validation<TValue, TModel>[];

  if (applyConditions) {
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
  }

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  (validator.validations as any)[key] = existingValidations.concat(validations);
  return validator as Validator<TModel, ModelValidations & { [P in Key]: Validation<TValue, TModel>[] }>;
}
