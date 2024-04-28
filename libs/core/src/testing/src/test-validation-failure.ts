import { Severity } from '../../lib/models';
import { ValidationFailure } from '../../lib/result';
import { TestValidationError } from './test-validation-error';

/**
 * Represents a test array of ValidationFailure.
 */
export class TestValidationFailures extends Array<ValidationFailure> {
  /**
   * Creates a TestValidationFailures instance from an array of ValidationFailure objects.
   *
   * @param validationFailures - An array of ValidationFailure objects.
   * @returns A TestValidationFailures instance.
   */
  public static fromValidationFailures(validationFailures: ValidationFailure[]): TestValidationFailures {
    return new TestValidationFailures(...validationFailures);
  }

  /**
   * Checks the expected error message and throws an error if the actual message does not match.
   * @param message The expected error message.
   * @returns The current TestValidationFailures instance.
   * @throws An error if the actual message does not match the expected message.
   */
  public withMessage(message: string): this {
    if (this.some(failure => failure.message !== message)) {
      throw new TestValidationError(`Expected error message to be "${message}"`);
    }
    return this;
  }

  /**
   * Checks the expected error severity and throws an error if the actual severity does not match.
   * @param severity The expected error severity.
   * @returns The current TestValidationFailures instance.
   * @throws An error if the actual severity does not match the expected severity.
   */
  public withSeverity(severity: Severity): this {
    if (this.some(failure => failure.severity !== severity)) {
      throw new TestValidationError(`Expected error severity to be "${severity}"`);
    }
    return this;
  }

  /**
   * Checks the expected error code and throws an error if the actual code does not match.
   * @param errorCode The expected error code.
   * @returns The current TestValidationFailures instance.
   * @throws An error if the actual code does not match the expected code.
   */
  public withErrorCode(errorCode: string): this {
    if (this.some(failure => failure.errorCode !== errorCode)) {
      throw new TestValidationError(`Expected error code to be "${errorCode}"`);
    }
    return this;
  }
}
