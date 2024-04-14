import { createMessageFormatter } from './message-formatter';
import { ValidationFailure } from './result';

export class ValidationContext<T> {
  private readonly _failures: ValidationFailure[] = [];

  public get failues(): ValidationFailure[] {
    return this._failures;
  }

  public readonly messageFormatter = createMessageFormatter();

  constructor(public readonly instanceToValidate: T) {}

  public addFailure(failure: ValidationFailure): void {
    this._failures.push(failure);
  }
}
