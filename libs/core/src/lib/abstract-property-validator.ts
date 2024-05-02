import { CascadeMode } from './models';
import { AbstractAsyncRule, AbstractRule } from './rules/rule';
import { KeyOf } from './ts-helpers';
import { ValidationContext } from './validation-context';

/**
 * Represents an abstract base class for property validators.
 *
 * @typeParam T - The type of the object being validated.
 * @typeParam P - The type of the property being validated.
 */
export abstract class AbstractPropertyValidator<T, P> {
  /**
   * Represents the collection of property rules for a validator.
   */
  public readonly propertyRules: AbstractRule<T, P>[] = [];

  /**
   * Specifies the cascade mode for the property validator.
   * The cascade mode determines how validation should proceed when a validation failure occurs.
   * Possible values are:
   * - 'Continue': Continue validating all rules for the property, even if a validation failure occurs.
   * - 'Stop': Stop validating the property after the first validation failure occurs.
   */
  protected cascadeMode: CascadeMode = 'Continue';

  /**
   * Determines whether to process a rule based on the provided validation context.
   * If the rule has a `processWhen` function, it will be called with the instance to validate.
   * If the `processWhen` function returns `true`, the rule will be processed; otherwise, it will be skipped.
   *
   * @param rule - The rule to process.
   * @param validationContext - The validation context containing the instance to validate.
   * @returns A boolean value indicating whether to process the rule.
   */
  protected readonly processRuleWhen = <T, P>(rule: AbstractRule<T, P>, validationContext: ValidationContext<T>): boolean =>
    rule.processWhen ? rule.processWhen(validationContext.instanceToValidate) : true;
  /**
   * Determines whether to process the rule based on the `processUnless` condition.
   * If the `processUnless` condition is provided and evaluates to `true`, the rule will be processed.
   * If the `processUnless` condition is not provided or evaluates to `false`, the rule will not be processed.
   *
   * @param rule - The rule to be processed.
   * @param validationContext - The validation context containing the instance to be validated.
   * @returns A boolean value indicating whether the rule should be processed.
   */
  protected readonly processRuleUnless = <T, P>(rule: AbstractRule<T, P>, validationContext: ValidationContext<T>): boolean =>
    rule.processUnless ? !rule.processUnless(validationContext.instanceToValidate) : true;

  constructor(public readonly propertyName: KeyOf<T>) {}

  /**
   * Adds a rule to the property validator.
   * @param rule The rule to add.
   */
  public addRule(rule: AbstractRule<T, P>): void {
    this.propertyRules.push(rule);
  }

  /**
   * Sets the cascade mode for the validator.
   * @param cascadeMode The cascade mode to set.
   */
  public cascade(cascadeMode: CascadeMode): void {
    this.cascadeMode = cascadeMode;
  }

  /**
   * Ensures that all rules for the property are synchronous.
   * Throws an error if any of the rules are asynchronous.
   */
  protected ensureAllRulesSync(): void {
    if (this.propertyRules.some(rule => rule instanceof AbstractAsyncRule)) {
      throw new Error(
        `Validator for property '${this.propertyName}' contains asynchronous rules but was invoked synchronously. Please call 'validateAsync' rather than 'validate'.`
      );
    }
  }
}
