import { ValidationResult } from '../result/validation-result';
import { EmptyObject, KeyOf, RequiredByKeys } from './ts-helpers';

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
export type Validator<TModel extends object, Validations extends object = EmptyObject> = {
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
  ): Validator<TModel, Validations & { [P in Key]: ValidationFn<TModel[Key], TModel>[] }>;

  /**
   * Includes the validations from the given validator.
   *
   * **Note** neither the `cascadeMode` will be included nor the conditions applied to preceding validations.
   *
   * @param validator - The validator to include.
   */
  include<TIncludeModel extends TModel, IncludeValidations extends object = InferValidations<Validator<TIncludeModel>>>(
    validator: Validator<TIncludeModel, IncludeValidations>
  ): Validator<TModel & TIncludeModel, Validations & IncludeValidations>;

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

export type ValidationFnMetadata<TModel> = {
  when?: (model: TModel) => boolean;
  whenApplyTo?: ApplyConditionTo;
  unless?: (model: TModel) => boolean;
  unlessApplyTo?: ApplyConditionTo;
};

/**
 * Represents a validation function.
 */
export type ValidationFn<TValue = unknown, TModel = unknown> = {
  /**
   * The validation function that takes a value of type TValue and returns a boolean indicating whether the value is valid.
   */
  (value: TValue): boolean;
  /**
   * The message to use when the validation fails.
   */
  message?: string;
  /**
   * The metadata for the validation function.
   */
  metadata: ValidationFnMetadata<TModel>;
  /**
   * Adds a when condition to the validation function.
   *
   * @param when - The condition to apply.
   * @param applyTo - The target to which the condition should be applied.
   * @returns A new validation function with the condition applied.
   */
  when(predicate: (model: TModel) => boolean, applyTo?: ApplyConditionTo): ValidationFn<TValue, TModel>;
  /**
   * Adds an unless condition to the validation function.
   *
   * @param unless - The condition to apply.
   * @param applyTo - The target to which the condition should be applied.
   * @returns A new validation function with the condition applied.
   */
  unless(predicate: (model: TModel) => boolean, applyTo?: ApplyConditionTo): ValidationFn<TValue, TModel>;
  /**
   * Adds a message to the validation function.
   *
   * @param message - The message to use when the validation fails.
   */
  withMessage(message: string): ValidationFn<TValue, TModel>;
};

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
