import { MessageFormatter } from './message-formatter';
import { PropertyChain } from './property-chain';
import { ValidationFailure } from './result';

export class ValidationContext<T> {
  private readonly _failures: ValidationFailure[] = [];
  private _propertyChain: PropertyChain;
  private _propertyPath?: string;
  private _rawPropertyName?: string;

  public get failues(): ValidationFailure[] {
    return this._failures;
  }

  public get propertyChain(): PropertyChain {
    return this._propertyChain;
  }

  public get propertyPath(): string {
    return this._propertyPath || '';
  }

  public readonly messageFormatter = new MessageFormatter();

  constructor(public readonly instanceToValidate: T, propertyChain?: PropertyChain) {
    this._propertyChain = new PropertyChain(propertyChain);
  }

  public addFailure(failure: ValidationFailure): void;
  public addFailure(errorMessage: string): void;
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
    this._propertyChain = new PropertyChain();
  }
}
