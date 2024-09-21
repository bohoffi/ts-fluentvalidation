import { ValidationResult } from '../result/validation-result';
import { EmptyObject, IsAsyncCallable, KeyOf, RequiredByKeys } from './ts-helpers';

/**
 * Utility type for extracting the validations from a validator.
 *
 * @param T - The type to extract the validations from if it is a Validator type.
 */
// eslint-disable-next-line @typescript-eslint/no-unused-vars
export type InferValidations<T> = T extends Validator<infer TModel, infer Validations> ? Validations : EmptyObject;

/**
 * Represents a validator.
 */
export type Validator<TModel extends object, ModelValidations extends object = EmptyObject> = {
  /**
   * The validations for the validator.
   */
  readonly validations: ModelValidations;

  /**
   * Adds one or more validations for the given key optionally preceded with the specified cascade mode.
   *
   * @param key - The key to validate.
   * @param args - Validations to add optionally preceded by the cascade mode for the given key.
   */
  ruleFor<Key extends KeyOf<TModel>>(
    key: Key,
    ...args: [CascadeMode, ...Validation<TModel[Key], TModel>[]] | Validation<TModel[Key], TModel>[]
  ): Validator<TModel, ModelValidations & { [P in Key]: Validation<TModel[Key], TModel>[] }>;

  /**
   * Includes the validations from the given validator.
   *
   * **Note** neither the `cascadeMode` will be included nor the conditions applied to preceding validations.
   *
   * @param validator - The validator to include.
   */
  include<TIncludeModel extends TModel, IncludeValidations extends object = InferValidations<Validator<TIncludeModel>>>(
    validator: Validator<TIncludeModel, IncludeValidations>
  ): Validator<TModel & TIncludeModel, ModelValidations & IncludeValidations>;

  /**
   * Validates the given model against the validations.
   *
   * @param model - The model to validate.
   * @returns The validation result.
   */
  validate(model: TModel): ValidationResult;

  /**
   * Validates the given model against the validations respecting the passed configuration.
   *
   * @param model - The model to validate.
   * @param config - The configuration to apply.
   * @returns The validation result.
   * @throws {ValidationError} if the validator is configured to throw and any failures occur.
   */
  validate(model: TModel, config: (config: ValidatorConfig<TModel>) => void): ValidationResult;

  /**
   * Validates the given model asynchonously against the validations.
   *
   * @param model - The model to validate.
   * @returns The validation result.
   */
  validateAsync(model: TModel): Promise<ValidationResult>;

  /**
   * Validates the given model asynchonously against the validations respecting the passed configuration.
   *
   * @param model - The model to validate.
   * @param config - The configuration to apply.
   * @returns The validation result.
   * @throws {ValidationError} if the validator is configured to throw and any failures occur.
   */
  validateAsync(model: TModel, config: (config: ValidatorConfig<TModel>) => void): Promise<ValidationResult>;

  /**
   * Validates the given model against the validations and throws a ValidationError if any failures occur.
   *
   * @param model - The model to validate.
   * @returns The validation result.
   * @throws {ValidationError} if any failures occur.
   */
  validateAndThrow(model: TModel): ValidationResult;

  /**
   * Validates the given model against the validations and throws a ValidationError if any failures occur respecting the passed configuration.
   *
   * @param model - The model to validate.
   * @param config - The configuration to apply.
   * @throws {ValidationError} if any failures occur.
   */
  validateAndThrow(model: TModel, config: (config: ValidatorConfig<TModel>) => void): ValidationResult;
};

export type ValidationMetadata<TAsync extends boolean, TModel = unknown> = {
  isAsync: TAsync;
  when?: (model: TModel) => boolean;
  whenAsync?: (model: TModel) => Promise<boolean>;
  whenApplyTo?: ApplyConditionTo;
  unless?: (model: TModel) => boolean;
  unlessAsync?: (model: TModel) => Promise<boolean>;
  unlessApplyTo?: ApplyConditionTo;
};

export type ValidationFunction<TValue> = ((value: TValue) => boolean) | ((value: TValue) => Promise<boolean>);

type ValidationType<
  TValue,
  TValidationFunction extends ValidationFunction<TValue>,
  TModel = unknown
> = IsAsyncCallable<TValidationFunction> extends true ? AsyncValidation<TValue, TModel> : SyncValidation<TValue, TModel>;

export type ValidationBase<TValue, TValidationFunction extends ValidationFunction<TValue>, TModel = unknown> = {
  message?: string;
  metadata: ValidationMetadata<IsAsyncCallable<TValidationFunction>, TModel>;
  when(condition: (value: TModel) => boolean, applyTo?: ApplyConditionTo): ValidationType<TValue, TValidationFunction, TModel>;
  whenAsync(
    condition: (value: TModel) => Promise<boolean>,
    applyTo?: ApplyConditionTo
  ): ValidationType<TValue, TValidationFunction, TModel>;
  unless(condition: (value: TModel) => boolean, applyTo?: ApplyConditionTo): ValidationType<TValue, TValidationFunction, TModel>;
  unlessAsync(
    condition: (value: TModel) => Promise<boolean>,
    applyTo?: ApplyConditionTo
  ): ValidationType<TValue, TValidationFunction, TModel>;
  withMessage(message: string): ValidationType<TValue, TValidationFunction, TModel>;
} & TValidationFunction;

export type Validation<TValue = unknown, TModel = unknown> = SyncValidation<TValue, TModel> | AsyncValidation<TValue, TModel>;
export type SyncValidation<TValue, TModel = unknown> = ValidationBase<TValue, (value: TValue) => boolean, TModel>;
export type AsyncValidation<TValue, TModel = unknown> = ValidationBase<TValue, (value: TValue) => Promise<boolean>, TModel>;

/**
 * Represents the cascade mode for validation.
 * - 'Continue': Allows validation to continue even if a previous validation fails.
 * - 'Stop': Stops validation if a previous validation fails.
 *
 * **Note:** The default cascade mode is 'Continue'.
 */
export type CascadeMode = 'Continue' | 'Stop';

/**
 * Specifies the target to which a condition should be applied.
 * - `'AllValidators'`: The condition should be applied to all preceding validators.
 * - `'CurrentValidator'`: The condition should be applied to the current validator only.
 *
 * **Note:** The default value is `'AllValidators'`.
 */
export type ApplyConditionTo = 'AllValidators' | 'CurrentValidator';

/**
 * Configuration for the validator.
 */
export type ValidatorConfig<TModel extends object> = {
  /**
   * If true, the validator will throw a ValidationError if any failures occur.
   */
  throwOnFailures?: boolean;
  /**
   * The properties to include in the validation.
   */
  includeProperties?: KeyOf<TModel>[];
  /**
   * The cascade mode on validator level.
   */
  cascadeMode?: CascadeMode;
  /**
   * The cascade mode on property level.
   */
  propertyCascadeMode?: CascadeMode;
};

/**
 * Represents the configuration for validation with `cascadeMode` being required.
 */
export type ValidateConfig<TModel extends object> = RequiredByKeys<ValidatorConfig<TModel>, 'cascadeMode'>;
