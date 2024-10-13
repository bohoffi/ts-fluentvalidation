import { ValidationFailure } from '../result/validation-failure';

export class ValidationError extends Error {
  constructor(public readonly failures: ValidationFailure[]) {
    super(ValidationError.buildErrorMessage(failures));
    this.name = 'ValidationError';
  }

  private static buildErrorMessage(failures: ValidationFailure[]): string {
    const failureMessages = failures.map(failure => `\n -- ${failure.propertyName}: ${failure.message} Severity: ${failure.severity}`);
    return `Validation failed: ${failureMessages.join()}`;
  }
}
