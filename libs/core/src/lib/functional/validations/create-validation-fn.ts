import { ApplyConditionTo, ValidationFn } from '../types/types';

type ValidationFnOptions<TModel> = Pick<ValidationFn<unknown, TModel>, 'message'>;

/**
 * Creates a validation function.
 *
 * @template TValue The type of the value to be validated.
 * @template TModel The type of the model being validated.
 * @param fn The validation function that takes a value of type TValue and returns a boolean indicating whether the value is valid.
 * @returns The created validation function.
 */
export function createValidationFn<TValue, TModel = unknown>(fn: (value: TValue) => boolean): ValidationFn<TValue, TModel>;
/**
 * Creates a validation function with a message.
 *
 * @template TValue The type of the value to be validated.
 * @template TModel The type of the model being validated.
 * @param fn The validation function that takes a value of type TValue and returns a boolean indicating whether the value is valid.
 * @param message The message to use when the validation fails.
 * @returns The created validation function.
 */
export function createValidationFn<TValue, TModel = unknown>(fn: (value: TValue) => boolean, message: string): ValidationFn<TValue, TModel>;
/**
 * Creates a validation function with options.
 *
 * @template TValue The type of the value to be validated.
 * @template TModel The type of the model being validated.
 * @param fn - The validation function that takes a value of type TValue and returns a boolean indicating whether the value is valid.
 * @param options - The options for the validation function.
 * @returns The created validation function.
 */
export function createValidationFn<TValue, TModel = unknown>(
  fn: (value: TValue) => boolean,
  options: ValidationFnOptions<TModel>
): ValidationFn<TValue, TModel>;
export function createValidationFn<TValue, TModel>(
  fn: (value: TValue) => boolean,
  messageOrOptions?: string | ValidationFnOptions<TModel>
): ValidationFn<TValue, TModel> {
  const validationFn = (value: TValue) => fn(value);
  validationFn.metadata = {};

  const { message, ...otherOptions } = typeof messageOrOptions === 'string' ? { message: messageOrOptions } : messageOrOptions || {};

  if (message) {
    validationFn.message = message;
  }

  validationFn.when = <TModel>(when: (model: TModel) => boolean, whenApplyTo?: ApplyConditionTo) => {
    const whenFn = createValidationFn<TValue, TModel>(fn, { ...otherOptions, message });
    whenFn.metadata = { when, whenApplyTo };
    return whenFn;
  };
  validationFn.unless = (unless: (model: TModel) => boolean, unlessApplyTo?: ApplyConditionTo) => {
    const unlessFn = createValidationFn<TValue, TModel>(fn, { ...otherOptions, message });
    unlessFn.metadata = { unless, unlessApplyTo };
    return unlessFn;
  };

  return validationFn;
}
