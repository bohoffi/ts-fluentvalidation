import { IsAsyncCallable } from '../types/ts-helpers';
import { ApplyConditionTo, AsyncValidation, SyncValidation, ValidationBase, ValidationFunction, ValidationMetadata } from '../types/types';

type ValidationOptions<TModel> = Pick<SyncValidation<unknown, TModel>, 'message'>;

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
  return createValidationBase(fn, false, messageOrOptions);
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
  return createValidationBase(fn, true, messageOrOptions);
}

function createValidationBase<
  TValue,
  TValidationFunction extends ValidationFunction<TValue>,
  TModel = unknown,
  TAsync extends boolean = IsAsyncCallable<TValidationFunction>
>(
  fn: TValidationFunction,
  isAsync: TAsync,
  messageOrOptions?: string | ValidationOptions<TModel>
): ValidationBase<TValue, TValidationFunction, TModel> {
  const validation = (value: TValue) => fn(value);
  validation.metadata = { isAsync };

  const { message, ...otherOptions } = typeof messageOrOptions === 'string' ? { message: messageOrOptions } : messageOrOptions || {};

  if (message) {
    validation.message = message;
  }

  validation.when = (when: (model: TModel) => boolean, whenApplyTo?: ApplyConditionTo) => {
    const whenValidation = createValidationBase<TValue, TValidationFunction, TModel, TAsync>(fn, isAsync, { ...otherOptions, message });
    (whenValidation as any).metadata = { ...validation.metadata, when, whenApplyTo } as ValidationMetadata<TAsync, TModel>;
    return whenValidation;
  };
  validation.whenAsync = <TModel>(whenAsync: (model: TModel) => Promise<boolean>, whenApplyTo?: ApplyConditionTo) => {
    const whanAsyncValidation = createValidationBase<TValue, TValidationFunction, TModel, TAsync>(fn, isAsync, {
      ...otherOptions,
      message
    });
    (whanAsyncValidation as any).metadata = { ...validation.metadata, whenAsync, whenApplyTo } as ValidationMetadata<TAsync, TModel>;
    return whanAsyncValidation;
  };
  validation.unless = (unless: (model: TModel) => boolean, unlessApplyTo?: ApplyConditionTo) => {
    const unlessValidation = createValidationBase<TValue, TValidationFunction, TModel, TAsync>(fn, isAsync, { ...otherOptions, message });
    (unlessValidation as any).metadata = { ...validation.metadata, unless, unlessApplyTo } as ValidationMetadata<TAsync, TModel>;
    return unlessValidation;
  };
  validation.unlessAsync = <TModel>(unlessAsync: (model: TModel) => Promise<boolean>, whenApplyTo?: ApplyConditionTo) => {
    const unlessAsyncValidation = createValidationBase<TValue, TValidationFunction, TModel, TAsync>(fn, isAsync, {
      ...otherOptions,
      message
    });
    (unlessAsyncValidation as any).metadata = { ...validation.metadata, unlessAsync, whenApplyTo } as ValidationMetadata<TAsync, TModel>;
    return unlessAsyncValidation;
  };
  validation.withMessage = (message: string) => {
    const withMessageValidation = createValidationBase<TValue, TValidationFunction, TModel, TAsync>(fn, isAsync, {
      ...otherOptions,
      message
    });
    (withMessageValidation as any).metadata = { ...validation.metadata } as ValidationMetadata<TAsync, TModel>;
    return withMessageValidation;
  };

  return validation as unknown as ValidationBase<TValue, TValidationFunction, TModel>;
}
