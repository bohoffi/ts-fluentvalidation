import { MessageFormatter } from './message-formatter';
import { PropertyChain } from './property-chain';
import { ValidationFailure } from './result';
import { DefaultValidatorSelector } from './selectors/default-validator-selector';
import { ValidatorSelector } from './selectors/validator-selector';
import { ValidationStrategy } from './validation-strategy';

/**
 * Represents a validation context for validating an instance of type T.
 *
 * @typeParam T - The type of the instance to validate.
 */
export class ValidationContext<T> {
  private readonly _failures: ValidationFailure[] = [];
  private _propertyChain: PropertyChain;
  private _selector: ValidatorSelector;
  private _propertyPath?: string;
  private _rawPropertyName?: string;
  private _isChildContext = false;

  /**
   * Creates a new `ValidationContext` instance with the given options.
   *
   * @typeParam T - The type of the object being validated.
   * @param instance - The instance of the object being validated.
   * @param options - A function that takes a `ValidationStrategy` and configures it with the desired options.
   * @returns A new `ValidationContext` instance.
   */
  public static createWithOptions<T>(instance: T, options: (strategy: ValidationStrategy<T>) => void): ValidationContext<T> {
    const strategy = new ValidationStrategy<T>();
    options(strategy);
    return this.fromStrategy(instance, strategy);
  }

  private static fromStrategy<T>(instance: T, strategy: ValidationStrategy<T>): ValidationContext<T> {
    // TODO consume throw behavior from strategy
    return new ValidationContext(instance, undefined, strategy.getSelector());
  }

  public get failues(): ValidationFailure[] {
    return this._failures;
  }

  public get propertyChain(): PropertyChain {
    return this._propertyChain;
  }

  public get selector(): ValidatorSelector {
    return this._selector;
  }

  public get propertyPath(): string {
    return this._propertyPath || '';
  }

  public get isChildContext(): boolean {
    return this._isChildContext;
  }

  public readonly messageFormatter = new MessageFormatter();

  constructor(public readonly instanceToValidate: T, propertyChain?: PropertyChain, validatorSelector?: ValidatorSelector) {
    this._propertyChain = new PropertyChain(propertyChain);
    this._selector = validatorSelector || new DefaultValidatorSelector();
  }

  /**
   * Adds a validation failure to the context.
   * @param failure Failure to add.
   */
  public addFailure(failure: ValidationFailure): void;
  /**
   * Adds a validation failure to the context with the property name infered from the current property chain.
   * @param errorMessage Error message to add.
   */
  public addFailure(errorMessage: string): void;
  /**
   * Adds a validation failure to the context with the given property name.
   * @param propertyName Name of the property that failed validation.
   * @param errorMessage Error message to add.
   */
  public addFailure(propertyName: string, errorMessage: string): void;
  public addFailure(failureMessageOrPropertyName: ValidationFailure | string, errorMessage?: string): void {
    if (failureMessageOrPropertyName instanceof ValidationFailure) {
      this._failures.push(failureMessageOrPropertyName);
    } else if (errorMessage) {
      this._failures.push(
        new ValidationFailure(
          this._propertyChain.buildPropertyPath(failureMessageOrPropertyName),
          this.messageFormatter.formatWithPlaceholders(errorMessage)
        )
      );
    } else {
      this._failures.push(
        new ValidationFailure(this._propertyPath || '', this.messageFormatter.formatWithPlaceholders(failureMessageOrPropertyName))
      );
    }
  }

  public initializeForPropertyValidator(propertyPath: string, rawPropertyName: string): void {
    this._propertyPath = propertyPath;
    this._rawPropertyName = rawPropertyName;
  }

  public prepareForChildCollectionRule(): void {
    this._isChildContext = true;
    this._propertyChain = new PropertyChain();
  }
}
