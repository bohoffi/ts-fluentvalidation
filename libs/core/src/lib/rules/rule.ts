import { AsyncValidationFn, RuleCondition, SeverityProvider, ValidationFn } from '../models';
import { MessageFormatter } from '../message-formatter';
import { ValidationContext } from '../validation-context';
import { ValidationFailure } from '../result';
import { getErrorMessage } from '../resources/error-messages';

/**
 * Represents an abstract class for a conditional rule.
 * @typeParam T The type of the object being validated.
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
 * @typeParam T The type of the value being validated.
 */
abstract class ExtendedRule<T> extends ConditionalRule<T> {
  protected _propertyName?: string;
  protected _message?: string;
  protected _severityProvider: SeverityProvider<T, unknown> = () => 'Error';
  protected _errorCode?: string;

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

  /**
   * Sets the severity for the rule.
   * @param severityProvider The severity provider for the rule.
   * @returns The current instance of the rule.
   */
  public withSeverity(severityProvider: SeverityProvider<T, unknown>): this {
    this._severityProvider = severityProvider;
    return this;
  }

  /**
   * Gets the severity provider for the rule.
   * @returns The severity provider for the rule.
   */
  public get severityProvider(): SeverityProvider<T, unknown> {
    return this._severityProvider;
  }

  /**
   * Sets the error code for the rule.
   * @param errorCode The error code.
   * @returns The current instance of the rule.
   */
  public withErrorCode(errorCode: string): this {
    this._errorCode = errorCode;
    return this;
  }

  /**
   * Gets the error code for the rule.
   * @returns The error code for the rule.
   */
  public get errorCode(): string | undefined {
    return this._errorCode;
  }
}

/**
 * Represents an abstract rule that can be used for validation.
 * @typeParam T The type of the value being validated.
 * @typeParam P The type of the additional parameters required for validation.
 */
export abstract class AbstractRule<T, P> extends ExtendedRule<T> {
  /**
   * The name of the rule.
   */
  protected abstract readonly name: string;

  /**
   * Creates a new instance of the AbstractRule class.
   * @param validationFn The validation function to be used for validating the value.
   */
  constructor(protected readonly validationFn: ValidationFn<T, P>) {
    super();
  }

  /**
   * Validates the specified value.
   * @param value The value to validate.
   * @param validationContext The validation context.
   * @returns `true` if the value is valid, otherwise `false`.
   */
  public validate(value: P, validationContext: ValidationContext<T>): boolean {
    const isValid = this.validationFn(value, validationContext);
    if (isValid === false) {
      this.createValidationError(validationContext, value);
    }
    return isValid;
  }

  /**
   * Appends additional arguments to the error message formatter.
   * @param messageFormatter The message formatter to append the arguments to.
   */
  protected appendArguments?(messageFormatter: MessageFormatter, value: P): void;

  /**
   * Creates a validation error and adds it to the validation context.
   * @param validationContext - The validation context.
   * @param propertyValue - The value of the property being validated.
   */
  protected createValidationError(validationContext: ValidationContext<T>, propertyValue: P): void {
    validationContext.messageFormatter.appendOrUpdatePropertyName(this.propertyName || validationContext.propertyPath);
    validationContext.messageFormatter.appendOrUpdatePropertyValue(propertyValue);
    validationContext.messageFormatter.appendOrUpdateArgument(
      validationContext.messageFormatter.basePlaceholders.propertyPath,
      validationContext.propertyPath
    );
    this.appendArguments?.(validationContext.messageFormatter, propertyValue);

    const failure = new ValidationFailure(
      validationContext.propertyPath,
      validationContext.messageFormatter.formatWithPlaceholders(this.message || getErrorMessage(this.errorCode, this.name)),
      propertyValue as unknown
    );
    failure.severity = this.severityProvider(validationContext.instanceToValidate, propertyValue, validationContext);
    failure.errorCode = this.errorCode || this.name;

    validationContext.addFailure(failure);
  }
}

/**
 * Represents an abstract asynchronous rule.
 * @typeParam T The type of the object being validated.
 * @typeParam P The type of the property being validated.
 */
export abstract class AbstractAsyncRule<T, P> extends AbstractRule<T, P> {
  constructor(protected readonly asyncValidationFn: AsyncValidationFn<T, P>) {
    super(() => true);
  }

  /**
   * Validates the specified value asynchronously.
   * @param value The value to be validated.
   * @param validationContext The validation context.
   * @returns A promise that resolves to a boolean indicating whether the value is valid.
   */
  public async validateAsync(value: P, validationContext: ValidationContext<T>): Promise<boolean> {
    const isValid = await this.asyncValidationFn(value, validationContext);
    if (isValid === false) {
      this.createValidationError(validationContext, value);
    }
    return isValid;
  }
}
