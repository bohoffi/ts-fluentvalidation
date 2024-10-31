import { IsAsyncCallable, KeyOf } from './ts-helpers';
import { ApplyConditionTo, CascadeMode, Severity } from './types';
import { ValidatorCore } from './validator-core';

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
   * The existance of a value indicates that all property names should be overridden.
   */
  propertyNameOverride?: string;
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

  /**
   * A function that provides the custom state of the validation.
   *
   * @param model The model to validate.
   * @param value The value to validate.
   * @returns The state of the validation.
   */
  customStateProvider?: (model: TModel, value: unknown) => unknown;
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
   * Overrides all property names to use when the validation fails.
   *
   * @param propertyName The property name to use when the validation fails.
   */
  overridePropertyName(propertyName: string): ValidationBase<TValue, TValidationFunction, TModel>;
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
  withSeverity<TSeverityModel extends TModel>(
    severityProvider: (model: TSeverityModel) => Severity
  ): ValidationBase<TValue, TValidationFunction, TModel>;
  /**
   * Sets the severity of the validation failure based on the model and value.
   *
   * @param severityProvider A function that provides the severity of the validation failure based on the model and value.
   */
  withSeverity<TSeverityModel extends TModel, TSeverityValue extends TValue>(
    severityProvider: (model: TSeverityModel, value: TSeverityValue) => Severity
  ): ValidationBase<TValue, TValidationFunction, TModel>;

  /**
   * Sets the custom state of the validation.
   *
   * @param customState The custom state of the validation.
   */
  withState<TState>(customState: TState): ValidationBase<TValue, TValidationFunction, TModel>;
  /**
   * Sets the custom state of the validation.
   *
   * @param customStateProvider A function that provides the custom state of the validation.
   */
  withState<TStateModel extends TModel>(
    customStateProvider: (model: TStateModel) => unknown
  ): ValidationBase<TValue, TValidationFunction, TModel>;
  /**
   * Sets the custom state of the validation.
   *
   * @param customStateProvider A function that provides the custom state of the validation.
   */
  withState<TStateModel extends TModel, TStateValue extends TValue>(
    customStateProvider: (model: TStateModel, value: TStateValue) => unknown
  ): ValidationBase<TValue, TValidationFunction, TModel>;
} & TValidationFunction;

/**
 * Interface to store validations for a key.
 *
 * @internal
 */
export interface KeyValidations<TModel extends object> {
  key: KeyOf<TModel>;
  validations: Validation<TModel[KeyOf<TModel>], TModel>[];
  cascadeMode: CascadeMode;
}

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

export type ValidatorValidation<TValue, TValidationFunction extends ValidationFunction<TValue>, TModel> = Omit<
  ValidationBase<TValue, TValidationFunction, TModel>,
  'withErrorCode' | 'withMessage' | 'withPlaceholder' | 'withSeverity' | 'withState'
> &
  TValidationFunction & {
    validator: ValidatorCore<TValue & object>;
  };

/**
 * Represents a synchronous validation processed by a synchronous validator.
 *
 * @template TValue - The type of the value to validate.
 * @template TModel - The type of the model being validated.
 */
export type SyncValidatorValidation<TValue, TModel> = ValidatorValidation<TValue, (value: TValue) => boolean, TModel>;
/**
 * Represents an asynchronous validation processed by an ssynchronous validator.
 *
 * @template TValue - The type of the value to validate.
 * @template TModel - The type of the model being validated.
 */
export type AsyncValidatorValidation<TValue, TModel> = ValidatorValidation<TValue, (value: TValue) => Promise<boolean>, TModel>;

export function isValidatorValidation<TValue, TModel>(
  validation: Validation<TValue, TModel>
): validation is SyncValidatorValidation<TValue, TModel> | AsyncValidatorValidation<TValue, TModel> {
  return 'validator' in validation;
}
