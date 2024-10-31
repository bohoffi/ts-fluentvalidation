import { ValidationError } from './errors';
import { validateAsync } from './functions/validate-async';
import { validateSync } from './functions/validate-sync';
import { createValidationResult, ValidationResult } from './result';
import { ArrayKeyOf, EmptyObject, getLastElement, InferArrayElement, KeyOf } from './types/ts-helpers';
import { CascadeMode, ValidatorConfig } from './types/types';
import { KeyValidations, Validation } from './types/validations';
import { InferValidations, Validator } from './types/validator';
import { createValidationContext, isValidationContext, ValidationContext } from './validation-context';

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
  const keyValidations: KeyValidations<TModel>[] = [];
  const _defaultConfig: ValidatorConfig<TModel> = {
    cascadeMode: 'Continue'
  };
  const validatorConfig: ValidatorConfig<TModel> = {
    ..._defaultConfig,
    ...(config || {})
  };

  let preValidation: (validationContext: ValidationContext<TModel>, validationResult: ValidationResult) => boolean = () => true;

  /**
   * Updates the validators validations dictionary. Called after validations for a given key were added.
   *
   * @param validator - The validator to update.
   */
  function updateValidations(validator: Validator<TModel, ModelValidations>): void {
    (validator.validations as unknown) = keyValidations.reduce((acc, { key, validations: keyValidations }) => {
      if (!acc[key]) {
        acc[key] = [];
      }

      acc[key].push(...keyValidations);

      return acc;
    }, {} as Record<string, Validation<TModel[KeyOf<TModel>], TModel>[]>) as ModelValidations;
  }

  return {
    validations: _validations,

    ruleFor<Key extends KeyOf<TModel>>(
      key: Key,
      ...cascadeModeAndValidations: [CascadeMode, ...Validation<TModel[Key], TModel>[]] | Validation<TModel[Key], TModel>[]
    ): Validator<TModel, ModelValidations & { [P in Key]: Validation<TModel[Key], TModel>[] }> {
      const cascadeMode = typeof cascadeModeAndValidations[0] === 'string' ? (cascadeModeAndValidations.shift() as CascadeMode) : undefined;
      const validations = cascadeModeAndValidations as Validation<TModel[Key], TModel>[];

      overridePropertyNames(validations);
      applyConditions(...validations);

      keyValidations.push({
        key,
        validations: validations as Validation<TModel[KeyOf<TModel>], TModel>[],
        cascadeMode: cascadeMode || validatorConfig.propertyCascadeMode || 'Continue'
      });
      updateValidations(this);

      return this as Validator<TModel, ModelValidations & { [P in Key]: Validation<TModel[Key], TModel>[] }>;
    },

    ruleForEach<Key extends ArrayKeyOf<TModel>, TItem = InferArrayElement<TModel[Key]>>(
      key: Key,
      ...cascadeModeAndValidations: [CascadeMode, ...Validation<TItem, TModel>[]] | Validation<TItem, TModel>[]
    ): Validator<TModel, ModelValidations & { [P in Key]: Validation<TItem, TModel>[] }> {
      const cascadeMode = typeof cascadeModeAndValidations[0] === 'string' ? (cascadeModeAndValidations.shift() as CascadeMode) : undefined;
      const validations = cascadeModeAndValidations as Validation<TItem, TModel>[];

      overridePropertyNames(validations);
      applyConditions(...validations);

      keyValidations.push({
        key,
        validations: validations as Validation<TModel[KeyOf<TModel>], TModel>[],
        cascadeMode: cascadeMode || validatorConfig.propertyCascadeMode || 'Continue'
      });
      updateValidations(this);

      return this as Validator<TModel, ModelValidations & { [P in Key]: Validation<TItem, TModel>[] }>;
    },

    include<TIncludeModel extends TModel, IncludeValidations extends object = InferValidations<Validator<TIncludeModel>>>(
      validator: Validator<TIncludeModel, IncludeValidations>
    ): Validator<TModel & TIncludeModel, ModelValidations & IncludeValidations> {
      Object.entries(validator.validations).forEach(([key, validations]) => {
        keyValidations.push({
          key: key as KeyOf<TModel>,
          validations: validations as Validation<TModel[KeyOf<TModel>], TModel>[],
          cascadeMode: validatorConfig.propertyCascadeMode || 'Continue'
        });
        updateValidations(this);
      });

      return this as unknown as Validator<TModel & TIncludeModel, ModelValidations & IncludeValidations>;
    },

    preValidate(
      preValidationFunc: (validationContext: ValidationContext<TModel>, validationResult: ValidationResult) => boolean
    ): Validator<TModel, ModelValidations> {
      preValidation = preValidationFunc;
      return this;
    },

    validate(modelOrContext: TModel | ValidationContext<TModel>, config?: (config: ValidatorConfig<TModel>) => void): ValidationResult {
      config?.(validatorConfig);
      const context = getValidationContext(modelOrContext);

      const preValidationResult = createValidationResult(context.failures);
      const shouldContinue = preValidation(context, preValidationResult);
      if (!shouldContinue) {
        if (preValidationResult.isValid === false && validatorConfig.throwOnFailures) {
          throwValidationError(preValidationResult);
        }

        return createValidationResult(preValidationResult.failures);
      }

      validateSync(context, keyValidations, validatorConfig);
      return createValidationResult(context.failures);
    },

    async validateAsync(
      modelOrContext: TModel | ValidationContext<TModel>,
      config?: (config: ValidatorConfig<TModel>) => void
    ): Promise<ValidationResult> {
      config?.(validatorConfig);
      const context = getValidationContext(modelOrContext);

      const preValidationResult = createValidationResult(context.failures);
      const shouldContinue = preValidation(context, preValidationResult);
      if (!shouldContinue) {
        if (preValidationResult.isValid === false && validatorConfig.throwOnFailures) {
          throwValidationError(preValidationResult);
        }

        return createValidationResult(preValidationResult.failures);
      }

      await validateAsync(context, keyValidations, validatorConfig);
      return createValidationResult(context.failures);
    },

    validateAndThrow(model: TModel): ValidationResult {
      return this.validate(model, c => (c.throwOnFailures = true));
    },

    async validateAndThrowAsync(model: TModel): Promise<ValidationResult> {
      return await this.validateAsync(model, c => (c.throwOnFailures = true));
    }
  };
}

/**
 * Applies conditions if neccesary.
 *
 * @template TModel - The type of the model being validated.
 * @template TValue - The type of the value being validated.
 * @param validations - The validations to apply the conditions to.
 * @returns The updated validator.
 */
function applyConditions<TModel extends object, TValue>(...validations: Validation<TValue, TModel>[]): void {
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

  const lastWhenAsyncValidation = getLastElement(
    validations,
    v => v.metadata.whenAsync !== undefined && v.metadata.whenApplyTo !== 'CurrentValidator'
  );
  if (lastWhenAsyncValidation) {
    const index = validations.indexOf(lastWhenAsyncValidation);
    const whenAsync = lastWhenAsyncValidation.metadata.whenAsync as ((model: TModel) => Promise<boolean>) | undefined;
    if (whenAsync) {
      for (let i = 0; i < index; i++) {
        validations[i].metadata.whenAsync = whenAsync;
      }
    }
  }

  const lastUnlessAsyncValidation = getLastElement(
    validations,
    v => v.metadata.unlessAsync !== undefined && v.metadata.unlessApplyTo !== 'CurrentValidator'
  );
  if (lastUnlessAsyncValidation) {
    const index = validations.indexOf(lastUnlessAsyncValidation);
    const unlessAsync = lastUnlessAsyncValidation.metadata.unlessAsync as ((model: TModel) => Promise<boolean>) | undefined;
    if (unlessAsync) {
      for (let i = 0; i < index; i++) {
        validations[i].metadata.unlessAsync = unlessAsync;
      }
    }
  }
}

function overridePropertyNames<TValue, TModel extends object>(keyValidations: Validation<TValue, TModel>[]): void {
  const lastPropertyNameOverride = getLastElement(keyValidations, v => v.metadata.propertyNameOverride !== undefined);
  if (lastPropertyNameOverride) {
    const propertyNameOverride = lastPropertyNameOverride.metadata.propertyNameOverride as string;
    keyValidations.forEach(v => {
      if (v.metadata.propertyNameOverride === undefined) {
        v.metadata.propertyNameOverride = propertyNameOverride;
      }
    });
  }
}

function getValidationContext<TModel>(modelOrContext: TModel | ValidationContext<TModel>): ValidationContext<TModel> {
  return isValidationContext(modelOrContext) ? modelOrContext : createValidationContext(modelOrContext);
}

function throwValidationError(validationResult: ValidationResult): never {
  throw new ValidationError(validationResult.failures);
}
