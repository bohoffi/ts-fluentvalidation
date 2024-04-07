import { PropertyValidator } from './property-validator';
import { MemberExpression, ValidatorConfig } from './models';
import { AbstractRuleBuilder } from './rules/rule-builder';
import { TypedRuleBuilder } from './rules/rule-builders';
import { EmptyObject, KeyOf, Prettify } from './ts-helpers';
import { ValidationFailure } from './result/validation-failure';
import { ValidationResult } from './result/validation-result';

type ValidatorInitializer<T extends object> = Prettify<Omit<Validator<T>, 'validate'>>;
/**
 * Represents a function that initializes a Validator instance.
 * @template T - The type of the object being validated.
 * @param val - The Validator instance to be initialized.
 */
export type ValidatorInitFn<T extends object> = (val: ValidatorInitializer<T>) => void;
/**
 * Represents the arguments for a validator function.
 * @template T - The type of the object being validated.
 */
type ValidatorArgs<T extends object> = [ValidatorConfig, ValidatorInitFn<T>] | [ValidatorConfig] | [ValidatorInitFn<T>] | [];

/**
 * Represents a function that creates a rule builder for validating a property or member expression.
 * @template T - The type of the object being validated.
 */
type RuleFor<T extends object> = {
  /**
   * Creates a rule builder for validating a member expression.
   * @param memberExpression - The member expression to validate.
   * @returns A typed rule builder for the specified member expression.
   * @template V - The type of the member expression value.
   */
  <V>(memberExpression: MemberExpression<T, V>): TypedRuleBuilder<T, V>;

  /**
   * Creates a rule builder for validating a property.
   * @param propertyName - The name of the property to validate.
   * @returns A typed rule builder for the specified property.
   * @template PropertyName - The name of the property to validate.
   * @template V - The type of the property value.
   */
  <PropertyName extends KeyOf<T>, V = T[PropertyName]>(propertyName: PropertyName): TypedRuleBuilder<T, V>;
};

// Validator types
export type Validator<T extends object = EmptyObject> = {
  ruleFor: RuleFor<T>;
  /**
   * Validates the given object against the defined validation rules.
   * @param candidate - The object to be validated.
   * @returns A ValidationResult object containing the validation failures, if any.
   */
  validate(candidate: T): ValidationResult;
};

/**
 * Creates a validator object that allows defining validation rules for an object of type T.
 * @returns A Validator object.
 * @typeparam T - The type of the object to be validated.
 */
export function createValidator<T extends object = EmptyObject>(): Validator<T>;
/**
 * Creates a validator function for validating objects of type T.
 *
 * @template T - The type of the object to be validated.
 * @param initFn - A function that initializes the validator with validation rules.
 * @returns A validator function that can be used to validate objects of type T.
 */
export function createValidator<T extends object = EmptyObject>(initFn: ValidatorInitFn<T>): Validator<T>;
/**
 * Creates a validator function for validating objects of type T.
 *
 * @template T - The type of the object to be validated.
 * @param config - The configuration object for the validator.
 * @returns A validator function that can be used to validate objects of type T.
 */
export function createValidator<T extends object = EmptyObject>(config: ValidatorConfig): Validator<T>;
/**
 * Creates a validator with the specified configuration and initialization function.
 *
 * @template T - The type of object to validate.
 * @param config - The configuration for the validator.
 * @param initFn - The initialization function that will be called with the created validator instance.
 * @returns The created validator.
 */
export function createValidator<T extends object = EmptyObject>(config: ValidatorConfig, initFn: ValidatorInitFn<T>): Validator<T>;

export function createValidator<T extends object = EmptyObject>(...args: ValidatorArgs<T>): Validator<T> {
  const [config, initFn] = processValidatorArgs(args);

  const propertyValidators: Partial<Record<keyof T, PropertyValidator<T, unknown>>> = {};
  const validator: Validator<T> = {
    /**
     * Adds a validation rule for a specific property of the object being validated.
     * @param memberExpression - A function or string representing the property to validate.
     * @returns A TypedRuleBuilder object that allows defining validation rules for the property.
     * @typeparam V - The type of the property being validated.
     */
    ruleFor<V>(memberExpression: MemberExpression<T, V> | KeyOf<T>): TypedRuleBuilder<T, V> {
      const propertyName: KeyOf<T> | undefined =
        typeof memberExpression === 'function'
          ? (memberExpression.toString().match(/\.([^\s()]+)/)?.[1] as KeyOf<T> | undefined)
          : memberExpression;
      const validator = new PropertyValidator<T, V>(propertyName as KeyOf<T>);
      if (config.ruleLevelCascadeMode) {
        validator.cascade(config.ruleLevelCascadeMode);
      }
      propertyValidators[propertyName as KeyOf<T>] = validator as PropertyValidator<T, unknown>;
      return new AbstractRuleBuilder<T, V>(validator).build();
    },
    validate(candidate: T): ValidationResult {
      const result: ValidationFailure[] = [];

      for (const [key, rule] of Object.entries(propertyValidators)) {
        const validatorToProcess = rule as PropertyValidator<T, unknown>;
        const valueToProcess = candidate[key as KeyOf<T>];
        const validationResult = validatorToProcess.validate(valueToProcess, {
          candidate
        });

        validationResult.forEach(failure => {
          result.push(failure);
        });

        if (validationResult.length > 0 && config.validatorLevelCascadeMode === 'Stop') {
          break;
        }
      }
      return new ValidationResult(result);
    }
  };
  return initFn ? (initFn(validator), validator) : validator;
}

/**
 * Processes the validator arguments and returns a tuple containing the validator configuration and initialization function.
 *
 * @template T - The type of the object being validated.
 * @param args - The validator arguments.
 * @returns A tuple containing the validator configuration and initialization function.
 */
function processValidatorArgs<T extends object>(args: ValidatorArgs<T> = []): [ValidatorConfig, ValidatorInitFn<T> | undefined] {
  const config: ValidatorConfig =
    args[0] && 'validatorLevelCascadeMode' in args[0] ? (args.shift() as ValidatorConfig) : { validatorLevelCascadeMode: 'Continue' };
  const initFn = args[0] as ValidatorInitFn<T> | undefined;
  return [config, initFn];
}
