import { ValidationResult } from './result';
import { EmptyObject, Nullish } from './ts-helpers';
import { ValidationContext } from './validation-context';

/**
 * Represents a function type used for validating instances of a specific type.
 * @typeParam T The type of the instance to be validated.
 */
type Validate<T> = {
  /**
   * Validates the specified instance.
   * @param instance The instance to be validated.
   * @returns The validation result.
   */
  (instance: T): ValidationResult;
  /**
   * Validates the specified validation context.
   * @param validationContext The validation context to be used for validating the instance.
   * @returns The validation result.
   */
  (validationContext: ValidationContext<T>): ValidationResult;
};

/**
 * Represents a contract for a validator.
 * @typeParam T - The type of object to be validated.
 */
export type ValidatorContract<T extends object = EmptyObject> = {
  /**
   * Validates the specified instance.
   */
  validate: Validate<T>;
};

/**
 * Represents a function that takes an object of type `T` and returns a value of type `V`.
 * This function is typically used to access a member of an object.
 *
 * @typeParam T The type of the object.
 * @typeParam V The type of the value returned by the function.
 * @param obj The object from which to access the member.
 * @returns The value of the member.
 */
export type MemberExpression<T, V = unknown> = (obj: T) => V;

/**
 * Represents a string property that can be nullish.
 */
export type StringProperty = Nullish<string>;
/**
 * Represents a number property that can be nullish.
 */
export type NumberProperty = Nullish<number>;
/**
 * Represents a property implementing a numeric length property that can be nullish - e.g. an array or string.
 */
export type LengthProperty = Nullish<{ length: number }>;
/**
 * Represents an object property.
 */
export type ObjectProperty = object;

/**
 * Specifies the target to which a condition should be applied.
 * - `'AllValidators'`: The condition should be applied to all validators.
 * - `'CurrentValidator'`: The condition should be applied to the current validator only.
 */
export type ApplyConditionTo = 'AllValidators' | 'CurrentValidator';

/**
 * Represents the cascade mode for validation.
 * - 'Continue': Allows validation to continue even if a previous validation fails.
 * - 'Stop': Stops validation if a previous validation fails.
 */
export type CascadeMode = 'Continue' | 'Stop';

/**
 * Represents the severity level of a message.
 * Possible values are 'Error', 'Warning', and 'Info'.
 */
export type Severity = 'Error' | 'Warning' | 'Info';
/**
 * Represents a function that provides the severity level for a validation error.
 *
 * @typeParam T - The type of the model being validated.
 * @typeParam P - The type of the value being validated.
 * @param model - The model being validated.
 * @param value - The value being validated.
 * @param context - The validation context.
 * @returns The severity level for the validation error.
 */
export type SeverityProvider<T, P> = (model: T, value: P, context: ValidationContext<T>) => Severity;

/**
 * Represents the configuration options for a validator.
 */
export interface ValidatorConfig {
  /**
   * The cascade mode to be used for rule-level validations.
   */
  ruleLevelCascadeMode?: CascadeMode;

  /**
   * The cascade mode to be used for validator-level validations.
   */
  validatorLevelCascadeMode: CascadeMode;
}

/**
 * Represents a condition that determines whether a rule should be applied to a model.
 * The condition is a function that takes a model of type `T` and returns a boolean value.
 *
 * @typeParam T The type of the model.
 * @param model The model to evaluate the condition against.
 * @returns A boolean value indicating whether the condition is met.
 */
export type RuleCondition<T> = (model: T) => boolean;
/**
 * Represents a validation function that takes a value of type `P` and a validation context of type `ValidationContext<T>`,
 * and returns a boolean indicating whether the value passes the validation.
 *
 * @typeParam T - The type of the object being validated.
 * @typeParam P - The type of the value being validated.
 *
 * @param value - The value to be validated.
 * @param validationContext - The validation context containing additional information for the validation.
 *
 * @returns A boolean indicating whether the value passes the validation.
 */
export type ValidationFn<T, P> = (value: P, validationContext: ValidationContext<T>) => boolean;
/**
 * Represents an asynchronous validation function.
 * @typeParam T - The type of the object being validated.
 * @typeParam P - The type of the value being validated.
 * @param value - The value to be validated.
 * @param validationContext - The validation context containing additional information.
 * @returns A promise that resolves to a boolean indicating whether the value is valid.
 */
export type AsyncValidationFn<T, P> = (value: P, validationContext: ValidationContext<T>) => Promise<boolean>;

/**
 * Represents a function that defines a rule predicate.
 * A rule predicate takes a value of type `P` and a model of type `T`,
 * and returns a boolean indicating whether the rule is satisfied.
 *
 * @typeParam T The type of the model.
 * @typeParam P The type of the value being validated.
 * @param propertyValue The value being validated.
 * @param instanceToValidate The model being validated.
 * @param validationContext The validation context.
 * @returns A boolean indicating whether the rule is satisfied.
 */
export type RulePredicate<T, P> = (propertyValue: P, instanceToValidate: T, validationContext: ValidationContext<T>) => boolean;
/**
 * Represents a predicate function that performs an asynchronous validation rule on a property value.
 *
 * @typeParam T - The type of the instance to validate.
 * @typeParam P - The type of the property value to validate.
 * @param propertyValue - The value of the property to validate.
 * @param instanceToValidate - The instance to validate.
 * @param validationContext - The validation context.
 * @returns A promise that resolves to a boolean indicating whether the validation rule passes.
 */
export type AsyncRulePredicate<T, P> = (
  propertyValue: P,
  instanceToValidate: T,
  validationContext: ValidationContext<T>
) => Promise<boolean>;
