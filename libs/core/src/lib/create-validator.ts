import { ValidatorConfig } from './models';
import { EmptyObject, Prettify } from './ts-helpers';
import { AbstractValidator } from './abstract-validator';

export type ValidatorInitializer<T extends object> = Prettify<Omit<AbstractValidator<T>, 'validate'>>;
/**
 * Represents a function that initializes a Validator instance.
 *
 * @typeParam T - The type of the object being validated.
 * @param val - The Validator instance to be initialized.
 */
export type ValidatorInitFn<T extends object> = (val: ValidatorInitializer<T>) => void;
/**
 * Represents the arguments for a validator function.
 *
 * @typeParam T - The type of the object being validated.
 */
export type ValidatorArgs<T extends object> = [ValidatorConfig, ValidatorInitFn<T>] | [ValidatorConfig] | [ValidatorInitFn<T>] | [];

/**
 * Creates an inline validator that allows defining validation rules for an object of type T.
 *
 * @returns A Validator object.
 * @typeparam T - The type of the object to be validated.
 * @returns an instance of the validator.
 */
export function createValidator<T extends object = EmptyObject>(): AbstractValidator<T>;
/**
 * Creates an inline validator that allows defining validation rules for an object of type T.
 *
 * @typeParam T - The type of the object to be validated.
 * @param initFn - A function that initializes the validator with validation rules.
 * @returns an instance of the validator.
 */
export function createValidator<T extends object = EmptyObject>(initFn: ValidatorInitFn<T>): AbstractValidator<T>;
/**
 * Creates an inline validator that allows defining validation rules for an object of type T.
 *
 * @typeParam T - The type of the object to be validated.
 * @param config - The configuration object for the validator.
 * @returns an instance of the validator.
 */
export function createValidator<T extends object = EmptyObject>(config: ValidatorConfig): AbstractValidator<T>;
/**
 * Creates an inline validator that allows defining validation rules for an object of type T.
 *
 * @typeParam T - The type of object to validate.
 * @param config - The configuration for the validator.
 * @param initFn - The initialization function that will be called with the created validator instance.
 * @returns an instance of the validator.
 */
export function createValidator<T extends object = EmptyObject>(config: ValidatorConfig, initFn: ValidatorInitFn<T>): AbstractValidator<T>;

/**
 * Creates an inline validator that allows defining validation rules for an object of type T.
 *
 * @typeParam  T - The type of object to validate.
 * @param args arguments for the validator (configuration and initialization function).
 * @returns an instance of the validator.
 */
export function createValidator<T extends object = EmptyObject>(...args: ValidatorArgs<T>): AbstractValidator<T> {
  const [config, initFn] = processValidatorArgs(args);

  const validator = createInlineValidator<T>(config);

  return initFn ? (initFn(validator), validator) : validator;
}

/**
 * Creates an inline validator for the specified object type.
 *
 * @typeParam T - The type of object to validate.
 * @param config - The configuration for the validator.
 * @returns The created inline validator.
 */
function createInlineValidator<T extends object>(config: ValidatorConfig): AbstractValidator<T> {
  return new (class extends AbstractValidator<T> {
    constructor() {
      super();
      this.classLevelCascadeMode = config.validatorLevelCascadeMode;
      this.ruleLevelCascadeMode = config.ruleLevelCascadeMode || 'Continue';
    }
  })();
}

/**
 * Processes the validator arguments and returns a tuple containing the validator configuration and initialization function.
 *
 * @template T - The type of the object being validated.
 * @param args - The validator arguments.
 * @returns A tuple containing the validator configuration and initialization function.
 */
function processValidatorArgs<T extends object>(args: ValidatorArgs<T>): [ValidatorConfig, ValidatorInitFn<T> | undefined] {
  const config: ValidatorConfig =
    args[0] && 'validatorLevelCascadeMode' in args[0] ? (args.shift() as ValidatorConfig) : { validatorLevelCascadeMode: 'Continue' };
  const initFn = args[0] as ValidatorInitFn<T> | undefined;
  return [config, initFn];
}
