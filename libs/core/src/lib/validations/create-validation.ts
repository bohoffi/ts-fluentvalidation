import { IsAsyncCallable } from '../types/ts-helpers';
import { ApplyConditionTo, Severity } from '../types/types';
import {
  AsyncValidation,
  isValidatorValidation,
  SyncValidation,
  ValidationBase,
  ValidationFunction,
  ValidationMetadata,
  ValidatorValidation
} from '../types/validations';
import { ValidationContext } from '../validation-context';

type ValidationOptions<TModel> = Pick<ValidationMetadata<boolean, TModel>, 'message' | 'errorCode'>;

/**
 * Creates a synchronous validation function.
 *
 * @template TValue The type of the value to be validated.
 * @template TModel The type of the model being validated.
 * @param fn The validation function that takes a value of type TValue and returns a boolean indicating whether the value is valid.
 * @returns The created validation function.
 */
export function createValidation<TValue, TModel = unknown>(fn: (value: TValue) => boolean): SyncValidation<TValue, TModel>;
/**
 * Creates a synchronous validation function with a message.
 *
 * @template TValue The type of the value to be validated.
 * @template TModel The type of the model being validated.
 * @param fn The validation function that takes a value of type TValue and returns a boolean indicating whether the value is valid.
 * @param message The message to use when the validation fails.
 * @returns The created validation function.
 */
export function createValidation<TValue, TModel = unknown>(fn: (value: TValue) => boolean, message: string): SyncValidation<TValue, TModel>;
/**
 * Creates a synchronous validation function with options.
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
 * Creates an asynchronous validation function with a mesage.
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
 * Creates an asynchronous validation function with options.
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
  validation.metadata = {
    isAsync: isAsync as IsAsyncCallable<TValidationFunction>,
    message,
    errorCode: otherOptions.errorCode,
    placeholders: {}
  } as ValidationMetadata<IsAsyncCallable<TValidationFunction>, TModel>;

  const metadata: ValidationMetadata<IsAsyncCallable<TValidationFunction>, TModel> = {
    isAsync: isAsync as IsAsyncCallable<TValidationFunction>,
    message,
    errorCode: otherOptions.errorCode,
    placeholders: {}
  };

  function createWithMetadata<TModel>(
    modifications:
      | ((metadata: ValidationMetadata<IsAsyncCallable<TValidationFunction>, TModel>) => void)
      | Partial<ValidationMetadata<IsAsyncCallable<TValidationFunction>, TModel>>
  ): ValidationBase<TValue, TValidationFunction, TModel> {
    const modifiedValidation = createValidationBase<TValue, TValidationFunction, TModel, TAsync>(fn, isAsync, { ...otherOptions, message });
    if (typeof modifications === 'function') {
      modifications(modifiedValidation.metadata);
    } else {
      modifiedValidation.metadata = { ...validation.metadata, ...modifications } as ValidationMetadata<
        IsAsyncCallable<TValidationFunction>,
        TModel
      >;
    }
    return modifiedValidation;
  }

  /**
   * Applies a synchronous condition when to execute the validation.
   *
   * @param predicate - The condition to apply.
   * @param applyConditionTo - The target to which the condition should be applied.
   */
  function applyCondition(
    condition: (model: TModel, validationContext: ValidationContext<TModel>) => boolean,
    applyConditionTo: ApplyConditionTo = 'AllValidators'
  ): ValidationBase<TValue, TValidationFunction, TModel> {
    let _condition: (model: TModel, validationContext: ValidationContext<TModel>) => boolean;
    if (validation.metadata.condition === undefined) {
      _condition = condition;
    } else {
      const original = validation.metadata.condition;
      _condition = (model, validationContext) => original(model, validationContext) && condition(model, validationContext);
    }

    const updatedValidation = createWithMetadata({ condition: _condition, applyConditionTo });
    return updatedValidation;
  }

  function applyAsyncCondition(
    condition: (model: TModel, validationContext: ValidationContext<TModel>) => Promise<boolean>,
    applyAsyncConditionTo: ApplyConditionTo = 'AllValidators'
  ): ValidationBase<TValue, TValidationFunction, TModel> {
    let _asyncCondition: (model: TModel, validationContext: ValidationContext<TModel>) => Promise<boolean>;
    if (validation.metadata.asyncCondition === undefined) {
      _asyncCondition = condition;
    } else {
      const original = validation.metadata.asyncCondition;
      _asyncCondition = async (model, validationContext) =>
        (await original(model, validationContext)) && (await condition(model, validationContext));
    }

    const updatedValidation = createWithMetadata({ asyncCondition: _asyncCondition, applyAsyncConditionTo });
    return updatedValidation;
  }

  const validationBase: ValidationBase<TValue, TValidationFunction, TModel> = {
    metadata,

    invokeCondition(model: TModel, validationContext: ValidationContext<TModel>): boolean {
      return this.metadata.condition ? this.metadata.condition(model, validationContext) : true;
    },

    async invokeAsyncCondition(model: TModel, validationContext: ValidationContext<TModel>): Promise<boolean> {
      return this.metadata.asyncCondition ? this.metadata.asyncCondition(model, validationContext) : true;
    },

    when(
      predicate: (model: TModel, validationContext: ValidationContext<TModel>) => boolean,
      applyConditionTo: ApplyConditionTo = 'AllValidators'
    ): ValidationBase<TValue, TValidationFunction, TModel> {
      return applyCondition((model, validationContext) => predicate(model, validationContext), applyConditionTo);
    },

    whenAsync(
      predicate: (model: TModel, validationContext: ValidationContext<TModel>) => Promise<boolean>,
      applyConditionTo: ApplyConditionTo = 'AllValidators'
    ): ValidationBase<TValue, TValidationFunction, TModel> {
      return applyAsyncCondition((model, validationContext) => predicate(model, validationContext), applyConditionTo);
    },

    unless(
      predicate: (model: TModel, validationContext: ValidationContext<TModel>) => boolean,
      applyConditionTo: ApplyConditionTo = 'AllValidators'
    ): ValidationBase<TValue, TValidationFunction, TModel> {
      return this.when((model, validationContext) => !predicate(model, validationContext), applyConditionTo);
    },

    unlessAsync(
      predicate: (model: TModel, validationContext: ValidationContext<TModel>) => Promise<boolean>,
      applyConditionTo: ApplyConditionTo = 'AllValidators'
    ): ValidationBase<TValue, TValidationFunction, TModel> {
      return this.whenAsync(async (model, validationContext) => !(await predicate(model, validationContext)), applyConditionTo);
    },

    withMessage(message: string): ValidationBase<TValue, TValidationFunction, TModel> {
      return createWithMetadata({ message });
    },

    withErrorCode(errorCode: string): ValidationBase<TValue, TValidationFunction, TModel> {
      return createWithMetadata({ errorCode });
    },

    withName(propertyName: string): ValidationBase<TValue, TValidationFunction, TModel> {
      const withNameValidation = createWithMetadata<TModel>({ propertyName });

      if (isValidatorValidation(validation)) {
        (withNameValidation as unknown as ValidatorValidation<TValue, TValidationFunction, TModel>).validator = validation.validator;
      }

      return withNameValidation;
    },

    overridePropertyName(propertyNameOverride: string): ValidationBase<TValue, TValidationFunction, TModel> {
      const overridePropertyNameValidation = createWithMetadata<TModel>({ propertyNameOverride });

      if (isValidatorValidation(validation)) {
        (overridePropertyNameValidation as unknown as ValidatorValidation<TValue, TValidationFunction, TModel>).validator =
          validation.validator;
      }

      return overridePropertyNameValidation;
    },

    withPlaceholder(key: string, value: unknown): ValidationBase<TValue, TValidationFunction, TModel> {
      return createWithMetadata({ placeholders: { ...validation.metadata.placeholders, [key]: value } });
    },

    withSeverity(
      severityOrProvider: Severity | ((model: TModel, value: TValue) => Severity)
    ): ValidationBase<TValue, TValidationFunction, TModel> {
      return createWithMetadata({
        severityProvider: (typeof severityOrProvider === 'function' ? severityOrProvider : () => severityOrProvider) as (
          model: TModel,
          value: unknown
        ) => Severity
      });
    },

    withState(stateProvider: unknown | ((model: TModel, value: TValue) => unknown)): ValidationBase<TValue, TValidationFunction, TModel> {
      return createWithMetadata({
        customStateProvider: (typeof stateProvider === 'function' ? stateProvider : () => stateProvider) as (
          model: TModel,
          value: unknown
        ) => unknown
      });
    }
  } as ValidationBase<TValue, TValidationFunction, TModel>;

  return Object.assign(validation, validationBase);
}
