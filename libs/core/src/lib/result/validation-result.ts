import { ValidationFailure } from './validation-failure';

export class ValidationResult {
  public get isValid(): boolean {
    return this.failures.length === 0;
  }

  constructor(public readonly failures: ValidationFailure[] = []) {}
}
