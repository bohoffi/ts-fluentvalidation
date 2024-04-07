import { RuleCondition, ValidationFn } from '../models';
import { MessageFormatter } from '../message-formatter';

/**
 * Represents an abstract class for a conditional rule.
 * @template T The type of the object being validated.
 */
abstract class ConditionalRule<T> {
  protected when: RuleCondition<T> | null = null;
  protected unless: RuleCondition<T> | null = null;

  /**
   * Gets the condition under which the rule should be processed.
   *
   * @returns The condition under which the rule should be processed, or `null` if there is no condition.
   */
  public get processWhen(): RuleCondition<T> | null {
    return this.when;
  }

  /**
   * Gets the condition for when the rule should be processed.
   * If the condition is not met, the rule will be skipped.
   *
   * @returns The condition for when the rule should be processed, or `null` if there is no condition.
   */
  public get processUnless(): RuleCondition<T> | null {
    return this.unless;
  }

  /**
   * Sets the condition for when the rule should be applied.
   * @param condition The condition to be evaluated.
   * @returns The current instance of the rule.
   */
  public withWhenCondition(condition: RuleCondition<T>): this {
    this.when = condition;
    return this;
  }

  /**
   * Sets the condition for when the rule should not be applied.
   * @param condition The condition to be evaluated.
   * @returns The current instance of the rule.
   */
  public withUnlessCondition(condition: RuleCondition<T>): this {
    this.unless = condition;
    return this;
  }
}

/**
 * Represents an abstract class for extended rules.
 * @template T The type of the object being validated.
 */
/**
 * Represents an abstract class for extended rules.
 * @template T The type of the value being validated.
 */
abstract class ExtendedRule<T> extends ConditionalRule<T> {
  protected _propertyName?: string;
  protected _message?: string;

  /**
   * Sets the name of the property being validated.
   * @param propertyName The name of the property.
   * @returns The current instance of the rule.
   */
  public withName(propertyName: string): this {
    this._propertyName = propertyName;
    return this;
  }

  /**
   * Gets the name of the property associated with this rule.
   * @returns The name of the property.
   */
  public get propertyName(): string | undefined {
    return this._propertyName;
  }

  /**
   * Sets the error message for the rule.
   * @param message The error message.
   * @returns The current instance of the rule.
   */
  public withMessage(message: string): this {
    this._message = message;
    return this;
  }

  /**
   * Gets the message associated with this rule.
   * @returns The message string or undefined if no message is set.
   */
  public get message(): string | undefined {
    return this._message;
  }
}

/**
 * Represents an abstract rule that can be used for validation.
 * @template T The type of the value being validated.
 * @template P The type of the additional parameters required for validation.
 */
export abstract class AbstractRule<T, P> extends ExtendedRule<T> {
  /**
   * The error message associated with the rule.
   */
  public abstract readonly errorMessage: string;

  /**
   * The validation function to be used for validating the value.
   */
  public readonly validate: ValidationFn<T, P>;

  /**
   * Creates a new instance of the AbstractRule class.
   * @param validationFn The validation function to be used for validating the value.
   */
  constructor(validationFn: ValidationFn<T, P>) {
    super();
    this.validate = validationFn;
  }

  /**
   * Appends additional arguments to the error message formatter.
   * @param messageFormatter The message formatter to append the arguments to.
   */
  public appendArguments?(messageFormatter: MessageFormatter): void;
}
