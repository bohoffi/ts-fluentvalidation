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

  public addFailure(failure: ValidationFailure): void {
    this._failures.push(failure);
  }

  public initializeForPropertyValidator(propertyPath: string, rawPropertyName: string): void {
    this._propertyPath = propertyPath;
    this._rawPropertyName = rawPropertyName;
  }

  public prepareForChildCollectionRule(): void {
    this._propertyChain = new PropertyChain();
  }
}
