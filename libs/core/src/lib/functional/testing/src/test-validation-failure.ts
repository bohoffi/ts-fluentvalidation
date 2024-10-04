import { ValidationFailure } from '../../result/validation-failure';
import { Severity } from '../../types/types';
import { TestValidationError } from './test-validation-error';

/**
 * Represents a test array of ValidationFailure.
 */
export class TestValidationFailures extends Array<ValidationFailure> {
  /**
   * Checks the expected error message and throws an error if the actual message does not match.
   * @param message The expected error message.
   * @returns The current TestValidationFailures instance.
   * @throws An error if the actual message does not match the expected message.
   */
  public withMessage(message: string): this {
    return this.with(failure => failure.message === message, `Expected error message to be "${message}"`);
  }

  /**
   * Checks the expected error code and throws an error if the actual error code does not match.
   * @param errorCode The expected error code.
   * @returns The current TestValidationFailures instance.
   * @throws An error if the actual error code does not match the expected error code.
   */
  public withErrorCode(errorCode: string): this {
    return this.with(failure => failure.errorCode === errorCode, `Expected error code to be "${errorCode}"`);
  }

  /**
   * Checks the expected error severity and throws an error if the actual severity does not match.
   * @param severity The expected error severity.
   * @returns The current TestValidationFailures instance.
   * @throws An error if the actual severity does not match the expected severity.
   */
  public withSeverity(severity: Severity): this {
    return this.with(failure => failure.severity === severity, `Expected error severity to be "${severity}"`);
  }

  private with(predicate: (failure: ValidationFailure) => boolean, message: string): this {
    if (this.some(failure => predicate(failure)) === false) {
      throw new TestValidationError(message);
    }
    return this;
  }
}
