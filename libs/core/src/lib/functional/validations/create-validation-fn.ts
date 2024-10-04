import { IsAsyncCallable } from '../types/ts-helpers';
import {
  ApplyConditionTo,
  AsyncValidation,
  Severity,
  SyncValidation,
  ValidationBase,
  ValidationFunction,
  ValidationMetadata
} from '../types/types';

type ValidationOptions<TModel> = Pick<ValidationMetadata<boolean, TModel>, 'message' | 'errorCode'>;

/**
 * Creates a validation function.
 *
 * @template TValue The type of the value to be validated.
 * @template TModel The type of the model being validated.
 * @param fn The validation function that takes a value of type TValue and returns a boolean indicating whether the value is valid.
 * @returns The created validation function.
 */
export function createValidation<TValue, TModel = unknown>(fn: (value: TValue) => boolean): SyncValidation<TValue, TModel>;
/**
 * Creates a validation function with a message.
 *
 * @template TValue The type of the value to be validated.
 * @template TModel The type of the model being validated.
 * @param fn The validation function that takes a value of type TValue and returns a boolean indicating whether the value is valid.
 * @param message The message to use when the validation fails.
 * @returns The created validation function.
 */
export function createValidation<TValue, TModel = unknown>(fn: (value: TValue) => boolean, message: string): SyncValidation<TValue, TModel>;
/**
 * Creates a validation function with options.
 *
 * @template TValue The type of the value to be validated.
 * @template TModel The type of the model being validated.
 * @param fn The validation function that takes a value of type TValue and returns a boolean indicating whether the value is valid.
 * @param options The options for the validation function.
 * @returns The created validation function.
 */
export function createValidation<TValue, TModel = unknown>(
  fn: (value: TValue) => boolean,
  options: ValidationOptions<TModel>
): SyncValidation<TValue, TModel>;
export function createValidation<TValue, TModel = unknown>(
  fn: (value: TValue) => boolean,
  messageOrOptions?: string | ValidationOptions<TModel>
): SyncValidation<TValue, TModel> {
  return createValidationBase<TValue, (value: TValue) => boolean, TModel, false>(fn, false, messageOrOptions);
}

/**
 * Creates an asynchronous validation function.
 *
 * @template TValue The type of the value to be validated.
 * @template TModel The type of the model being validated.
 * @param fn The asynchronous validation function that takes a value of type TValue and returns a promise that resolves to a boolean indicating whether the value is valid.
 * @returns The created asynchronous validation function.
 */
export function createAsyncValidation<TValue, TModel = unknown>(fn: (value: TValue) => Promise<boolean>): AsyncValidation<TValue, TModel>;
/**
 * Creates an asynchronous validation function.
 *
 * @template TValue The type of the value to be validated.
 * @template TModel The type of the model being validated.
 * @param fn The asynchronous validation function that takes a value of type TValue and returns a promise that resolves to a boolean indicating whether the value is valid.
 * @param message The message to use when the validation fails.
 * @returns The created asynchronous validation function.
 */
export function createAsyncValidation<TValue, TModel = unknown>(
  fn: (value: TValue) => Promise<boolean>,
  message: string
): AsyncValidation<TValue, TModel>;
/**
 * Creates an asynchronous validation function.
 *
 * @template TValue The type of the value to be validated.
 * @template TModel The type of the model being validated.
 * @param fn The asynchronous validation function that takes a value of type TValue and returns a promise that resolves to a boolean indicating whether the value is valid.
 * @param options The options for the validation function.
 * @returns The created asynchronous validation function.
 */
export function createAsyncValidation<TValue, TModel = unknown>(
  fn: (value: TValue) => Promise<boolean>,
  options: ValidationOptions<TModel>
): AsyncValidation<TValue, TModel>;
export function createAsyncValidation<TValue, TModel = unknown>(
  fn: (value: TValue) => Promise<boolean>,
  messageOrOptions?: string | ValidationOptions<TModel>
): AsyncValidation<TValue, TModel> {
  return createValidationBase<TValue, (value: TValue) => Promise<boolean>, TModel, true>(fn, true, messageOrOptions);
}

function createValidationBase<
  TValue,
  TValidationFunction extends ValidationFunction<TValue>,
  TModel,
  TAsync extends boolean = IsAsyncCallable<TValidationFunction>
>(
  fn: TValidationFunction,
  isAsync: TAsync,
  messageOrOptions?: string | ValidationOptions<TModel>
): ValidationBase<TValue, TValidationFunction, TModel> {
  const { message, ...otherOptions } = typeof messageOrOptions === 'string' ? { message: messageOrOptions } : messageOrOptions || {};

  const validation = (value: TValue) => fn(value);
  validation.metadata = { isAsync, message, errorCode: otherOptions.errorCode } as ValidationMetadata<
    IsAsyncCallable<TValidationFunction>,
    TModel
  >;
  validation.when = (
    when: (model: TModel) => boolean,
    whenApplyTo: ApplyConditionTo = 'AllValidators'
  ): ValidationBase<TValue, TValidationFunction, TModel> => {
    const whenValidation = createValidationBase<TValue, TValidationFunction, TModel, TAsync>(fn, isAsync, { ...otherOptions, message });
    whenValidation.metadata = {
      ...validation.metadata,
      when,
      whenApplyTo
    } as ValidationMetadata<IsAsyncCallable<TValidationFunction>, TModel>;
    return whenValidation;
  };
  validation.whenAsync = (
    whenAsync: (model: TModel) => Promise<boolean>,
    whenApplyTo: ApplyConditionTo = 'AllValidators'
  ): ValidationBase<TValue, TValidationFunction, TModel> => {
    const whenValidation = createValidationBase<TValue, TValidationFunction, TModel, TAsync>(fn, isAsync, { ...otherOptions, message });
    whenValidation.metadata = {
      ...validation.metadata,
      whenAsync,
      whenApplyTo
    };
    return whenValidation;
  };
  validation.unless = (
    unless: (model: TModel) => boolean,
    unlessApplyTo: ApplyConditionTo = 'AllValidators'
  ): ValidationBase<TValue, TValidationFunction, TModel> => {
    const unlessValidation = createValidationBase<TValue, TValidationFunction, TModel, TAsync>(fn, isAsync, { ...otherOptions, message });
    unlessValidation.metadata = {
      ...validation.metadata,
      unless,
      unlessApplyTo
    } as ValidationMetadata<IsAsyncCallable<TValidationFunction>, TModel>;
    return unlessValidation;
  };
  validation.unlessAsync = (
    unlessAsync: (model: TModel) => Promise<boolean>,
    unlessApplyTo: ApplyConditionTo = 'AllValidators'
  ): ValidationBase<TValue, TValidationFunction, TModel> => {
    const unlessValidation = createValidationBase<TValue, TValidationFunction, TModel, TAsync>(fn, isAsync, { ...otherOptions, message });
    unlessValidation.metadata = {
      ...validation.metadata,
      unlessAsync,
      unlessApplyTo
    };
    return unlessValidation;
  };
  validation.withMessage = (message: string): ValidationBase<TValue, TValidationFunction, TModel> => {
    const withMessageValidation = createValidationBase<TValue, TValidationFunction, TModel, TAsync>(fn, isAsync, {
      ...otherOptions,
      message
    });
    withMessageValidation.metadata = { ...validation.metadata, message };
    return withMessageValidation;
  };
  validation.withErrorCode = (errorCode: string): ValidationBase<TValue, TValidationFunction, TModel> => {
    const withMessageValidation = createValidationBase<TValue, TValidationFunction, TModel, TAsync>(fn, isAsync, {
      ...otherOptions,
      message
    });
    withMessageValidation.metadata = { ...validation.metadata, errorCode };
    return withMessageValidation;
  };
  validation.withSeverity = (
    severityOrProvider: Severity | ((model: TModel, value: TValue) => Severity)
  ): ValidationBase<TValue, TValidationFunction, TModel> => {
    const withSeverityValidation = createValidationBase<TValue, TValidationFunction, TModel, TAsync>(fn, isAsync, {
      ...otherOptions,
      message
    });
    withSeverityValidation.metadata = {
      ...validation.metadata,
      severityProvider: (typeof severityOrProvider === 'function' ? severityOrProvider : () => severityOrProvider) as (
        model: TModel,
        value: unknown
      ) => Severity
    };
    return withSeverityValidation;
  };

  return validation as unknown as ValidationBase<TValue, TValidationFunction, TModel>;
}
