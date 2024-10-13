import { ValidationResult } from '../result/validation-result';
import { ValidationContext } from '../validation-context';
import { ArrayKeyOf, EmptyObject, InferArrayElement, IsAsyncCallable, KeyOf, RequiredByKeys } from './ts-helpers';

/**
 * Utility type for extracting the validations from a validator.
 *
 * @param T - The type to extract the validations from if it is a Validator type.
 */
// eslint-disable-next-line @typescript-eslint/no-unused-vars
export type InferValidations<T> = T extends Validator<infer TModel, infer Validations> ? Validations : EmptyObject;

/**
 * Represents a validator.
 *
 * @template TModel - The type of the model to validate.
 * @template ModelValidations - The type of the validations for the model.
 */
export interface Validator<TModel extends object, ModelValidations extends object = EmptyObject> {
  /**
   * The validations for the validator.
   */
  readonly validations: ModelValidations;

  /**
   * Adds one or more validations for the given key.
   *
   * @param key - The key to validate.
   * @param validations - Validations to add.
   */
  ruleFor<Key extends KeyOf<TModel>>(
    key: Key,
    ...validations: Validation<TModel[Key], TModel>[]
  ): Validator<TModel, ModelValidations & { [P in Key]: Validation<TModel[Key], TModel>[] }>;

  /**
   * Adds one or more validations for the given key optionally preceded with the specified cascade mode.
   *
   * @param key - The key to validate.
   * @param cascadeModeAndValidations - Validations to add optionally preceded by the cascade mode for the given key.
   */
  ruleFor<Key extends KeyOf<TModel>>(
    key: Key,
    ...cascadeModeAndValidations: [CascadeMode, ...Validation<TModel[Key], TModel>[]]
  ): Validator<TModel, ModelValidations & { [P in Key]: Validation<TModel[Key], TModel>[] }>;

  /**
   * Adds one or more array validations for the given key.
   *
   * @param key - The key to validate.
   * @param validations - Validations to add.
   */
  ruleForEach<Key extends ArrayKeyOf<TModel>>(
    key: Key,
    ...validations: Validation<InferArrayElement<TModel[Key]>, TModel>[]
  ): Validator<TModel, ModelValidations & { [P in Key]: Validation<InferArrayElement<TModel[Key]>, TModel>[] }>;

  /**
   * Adds one or more array validations for the given key optionally preceded with the specified cascade mode.
   *
   * @param key - The key to validate.
   * @param cascadeModeAndValidations - Validations to add optionally preceded by the cascade mode for the given key.
   */
  ruleForEach<Key extends ArrayKeyOf<TModel>>(
    key: Key,
    ...cascadeModeAndValidations: [CascadeMode, ...Validation<InferArrayElement<TModel[Key]>, TModel>[]]
  ): Validator<TModel, ModelValidations & { [P in Key]: Validation<InferArrayElement<TModel[Key]>, TModel>[] }>;

  /**
   * Includes the validations from the given validator.
   *
   * @remarks Neither the `cascadeMode` will be included nor the conditions applied to preceding validations.
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
   * Validates the given validation context against the validations.
   *
   * @param validationContext - The validation context to validate.
   * @returns The validation result.
   */
  validate(validationContext: ValidationContext<TModel>): ValidationResult;

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
   * Validates the given validation context against the validations respecting the passed configuration.
   *
   * @param validationContext - The validation context to validate.
   * @param config - The configuration to apply.
   * @returns The validation result.
   * @throws {ValidationError} if the validator is configured to throw and any failures occur.
   */
  validate(validationContext: ValidationContext<TModel>, config: (config: ValidatorConfig<TModel>) => void): ValidationResult;

  /**
   * Validates the given model asynchonously against the validations.
   *
   * @param model - The model to validate.
   * @returns The validation result.
   */
  validateAsync(model: TModel): Promise<ValidationResult>;

  /**
   * Validates the given validation context asynchonously against the validations.
   *
   * @param validationContext - The validation context to validate.
   * @returns The validation result.
   */
  validateAsync(validationContext: ValidationContext<TModel>): Promise<ValidationResult>;

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
   * Validates the given validation context asynchonously against the validations respecting the passed configuration.
   *
   * @param validationContext - The validation context to validate.
   * @param config - The configuration to apply.
   * @returns The validation result.
   * @throws {ValidationError} if the validator is configured to throw and any failures occur.
   */
  validateAsync(validationContext: ValidationContext<TModel>, config: (config: ValidatorConfig<TModel>) => void): Promise<ValidationResult>;

  /**
   * Validates the given model against the validations and throws a ValidationError if any failures occur.
   *
   * @param model - The model to validate.
   * @returns The validation result.
   * @throws {ValidationError} if any failures occur.
   */
  validateAndThrow(model: TModel): ValidationResult;

  /**
   * Validates the given model asynchronously against the validations and throws a ValidationError if any failures occur.
   *
   * @param model - The model to validate.
   * @returns The validation result.
   * @throws {ValidationError} if any failures occur.
   */
  validateAndThrowAsync(model: TModel): Promise<ValidationResult>;
}

/**
 * Represents the metadata for validation.
 */
export interface ValidationMetadata<TAsync extends boolean, TModel> {
  /**
   * Indicates if the validation is asynchronous.
   */
  isAsync: TAsync;
  /**
   * The message to use when the validation fails.
   */
  message?: string;
  /**
   * The error code to use when the validation fails.
   */
  errorCode?: string;
  /**
   * The property name to use when the validation fails.
   */
  propertyName?: string;
  /**
   * The placeholders to use in the message when the validation fails.
   */
  readonly placeholders: Record<string, unknown>;
  /**
   * A function that determines if the validation should be applied based on the model.
   *
   * @param model The model to validate.
   * @returns True if the validation should be applied; otherwise, false.
   */
  when?: (model: TModel) => boolean;
  /**
   * An asynchronous function that determines if the validation should be applied based on the model.
   *
   * @param model The model to validate.
   * @returns Promise resolving to True if the validation should be applied; otherwise, false.
   */
  whenAsync?: (model: TModel) => Promise<boolean>;
  /**
   * The target to which the condition should be applied.
   */
  whenApplyTo?: ApplyConditionTo;
  /**
   * A function that determines if the validation should be skipped based on the model.
   *
   * @param model The model to validate.
   * @returns True if the validation should be skipped; otherwise, false.
   */
  unless?: (model: TModel) => boolean;
  /**
   * An asynchronous function that determines if the validation should be skipped based on the model.
   *
   * @param model The model to validate.
   * @returns True if the validation should be skipped; otherwise, false.
   */
  unlessAsync?: (model: TModel) => Promise<boolean>;
  /**
   * The target to which the condition should be applied.
   */
  unlessApplyTo?: ApplyConditionTo;
  /**
   * A function that provides the severity of the validation failure.
   *
   * @param model The model to validate.
   * @param value The value to validate.
   * @returns The severity of the validation failure.
   */
  severityProvider?: (model: TModel, value: unknown) => Severity;
}

export type ValidationFunction<TValue> = ((value: TValue) => boolean) | ((value: TValue) => Promise<boolean>);

/**
 * Represents the base for a validation.
 */
export type ValidationBase<TValue, TValidationFunction extends ValidationFunction<TValue>, TModel> = {
  /**
   * Metadata containing additional information about the validation.
   */
  metadata: ValidationMetadata<IsAsyncCallable<TValidationFunction>, TModel>;
  /**
   * Applies a synchronous condition when to execute the validation.
   *
   * @param condition The condition to apply.
   * @param applyTo The target to which the condition should be applied.
   */
  when<TModel>(condition: (value: TModel) => boolean, applyTo?: ApplyConditionTo): ValidationBase<TValue, TValidationFunction, TModel>;
  /**
   * Applies an asynchronous condition when to execute the validation.
   *
   * @param condition The condition to apply.
   * @param applyTo The target to which the condition should be applied.
   */
  whenAsync<TModel>(
    condition: (value: TModel) => Promise<boolean>,
    applyTo?: ApplyConditionTo
  ): ValidationBase<TValue, TValidationFunction, TModel>;
  /**
   * Applies a synchronous condition when to skip the validation.
   *
   * @param condition The condition to apply.
   * @param applyTo The target to which the condition should be applied.
   */
  unless<TModel>(condition: (value: TModel) => boolean, applyTo?: ApplyConditionTo): ValidationBase<TValue, TValidationFunction, TModel>;
  /**
   * Applies an asynchronous condition when to skip the validation.
   *
   * @param condition The condition to apply.
   * @param applyTo The target to which the condition should be applied.
   */
  unlessAsync<TModel>(
    condition: (value: TModel) => Promise<boolean>,
    applyTo?: ApplyConditionTo
  ): ValidationBase<TValue, TValidationFunction, TModel>;
  /**
   * Sets the message to use when the validation fails.
   *
   * @param message The message to use when the validation fails.
   */
  withMessage(message: string): ValidationBase<TValue, TValidationFunction, TModel>;
  /**
   * Sets the errorCode to use when the validation fails.
   *
   * @param errorCode The errorCode to use when the validation fails.
   */
  withErrorCode(errorCode: string): ValidationBase<TValue, TValidationFunction, TModel>;
  /**
   * Sets the property name to use when the validation fails.
   *
   * @param propertyName The property name to use when the validation fails.
   */
  withName(propertyName: string): ValidationBase<TValue, TValidationFunction, TModel>;
  /**
   * Adds a placeholder to use in the message when the validation fails.
   *
   * @param key - The key of the placeholder.
   * @param value - The value of the placeholder.
   */
  withPlaceholder(key: string, value: unknown): ValidationBase<TValue, TValidationFunction, TModel>;
  /**
   * Sets the severity of the validation failure.
   *
   * @param severity The severity of the validation failure.
   */
  withSeverity(severity: Severity): ValidationBase<TValue, TValidationFunction, TModel>;
  /**
   * Sets the severity of the validation failure based on the model.
   *
   * @param severityProvider A function that provides the severity of the validation failure based on the model.
   */
  withSeverity<TModel>(severityProvider: (model: TModel) => Severity): ValidationBase<TValue, TValidationFunction, TModel>;
  /**
   * Sets the severity of the validation failure based on the model and value.
   *
   * @param severityProvider A function that provides the severity of the validation failure based on the model and value.
   */
  withSeverity<TModel, TSeverityValue>(
    severityProvider: (model: TModel, value: TSeverityValue) => Severity
  ): ValidationBase<TValue, TValidationFunction, TModel>;
} & TValidationFunction;

/**
 * @internal
 */
export type Validation<TValue, TModel> =
  | SyncValidation<TValue, TModel>
  | SyncValidatorValidation<TValue, TModel>
  | AsyncValidation<TValue, TModel>
  | AsyncValidatorValidation<TValue, TModel>;

/**
 * Represents a synchronous validation.
 *
 * @template TValue - The type of the value to validate.
 * @template TModel - The type of the model being validated.
 */
export type SyncValidation<TValue, TModel> = ValidationBase<TValue, (value: TValue) => boolean, TModel>;
/**
 * Represents an asynchronous validation.
 *
 * @template TValue - The type of the value to validate.
 * @template TModel - The type of the model being validated.
 */
export type AsyncValidation<TValue, TModel> = ValidationBase<TValue, (value: TValue) => Promise<boolean>, TModel>;

export type SyncValidatorValidation<TValue, TModel> = Omit<
  ValidationBase<TValue, (value: TValue) => boolean, TModel>,
  'withErrorCode' | 'withMessage' | 'withName' | 'withPlaceholder' | 'withSeverity'
> &
  ((value: TValue) => boolean) & {
    validator: Validator<TValue & object>;
  };
export type AsyncValidatorValidation<TValue, TModel> = Omit<
  ValidationBase<TValue, (value: TValue) => Promise<boolean>, TModel>,
  'withErrorCode' | 'withMessage' | 'withName' | 'withPlaceholder' | 'withSeverity'
> &
  ((value: TValue) => Promise<boolean>) & {
    validator: Validator<TValue & object>;
  };

export function isValidatorValidation<TValue, TModel>(
  validation: Validation<TValue, TModel>
): validation is SyncValidatorValidation<TValue, TModel> | AsyncValidatorValidation<TValue, TModel> {
  return 'validator' in validation;
}

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
 * Represents the severity of a validation failure.
 */
export type Severity = 'Error' | 'Warning' | 'Info';

/**
 * Configuration for the validator.
 */
export interface ValidatorConfig<TModel extends object> {
  /**
   * If true, the validator will throw a ValidationError if any failures occur.
   */
  throwOnFailures?: boolean;
  /**
   * The properties to include in the validation.
   */
  includeProperties?: KeyOf<TModel> | KeyOf<TModel>[];
  /**
   * The cascade mode on validator level.
   */
  cascadeMode?: CascadeMode;
  /**
   * The cascade mode on property level.
   */
  propertyCascadeMode?: CascadeMode;
}

/**
 * Represents the configuration for validation with `cascadeMode` being required.
 *
 * @internal
 */
export type ValidateConfig<TModel extends object> = RequiredByKeys<ValidatorConfig<TModel>, 'cascadeMode'>;
