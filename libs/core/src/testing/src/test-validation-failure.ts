import { ValidationFailure } from '../../lib/result/validation-failure';
import { defaultEqualityFn, Severity, ValueEqualityFn } from '../../lib/types';
import { TestValidationError } from './test-validation-error';

/**
 * Represents a test array of ValidationFailure.
 */
export class TestValidationFailures extends Array<ValidationFailure> {
  /**
   * Checks the expected error message and throws an error if the actual message does not match.
   *
   * @param message The expected error message.
   * @returns The current TestValidationFailures instance.
   * @throws An error if the actual message does not match the expected message.
   */
  public withMessage(message: string): this {
    return this.with(failure => failure.message === message, `Expected error message to be "${message}"`);
  }

  /**
   * Checks the expected error message and throws an error if the actual message does match.
   *
   * @param message The error message expected to not be present.
   * @returns The current TestValidationFailures instance.
   * @throws An error if the actual message does match the expected message.
   */
  public withoutMessage(message: string): this {
    return this.with(failure => failure.message !== message, `Expected no error message to be "${message}"`);
  }

  /**
   * Checks the expected error code and throws an error if the actual error code does not match.
   *
   * @param errorCode The expected error code.
   * @returns The current TestValidationFailures instance.
   * @throws An error if the actual error code does not match the expected error code.
   */
  public withErrorCode(errorCode: string): this {
    return this.with(failure => failure.errorCode === errorCode, `Expected error code to be "${errorCode}"`);
  }

  /**
   * Checks the expected error code and throws an error if the actual error code does match.
   *
   * @param errorCode The error code expected to not be present.
   * @returns The current TestValidationFailures instance.
   * @throws An error if the actual error code does match the expected error code.
   */
  public withoutErrorCode(errorCode: string): this {
    return this.with(failure => failure.errorCode !== errorCode, `Expected no error code to be "${errorCode}"`);
  }

  /**
   * Checks the expected error severity and throws an error if the actual severity does not match.
   *
   * @param severity The expected error severity.
   * @returns The current TestValidationFailures instance.
   * @throws An error if the actual severity does not match the expected severity.
   */
  public withSeverity(severity: Severity): this {
    return this.with(failure => failure.severity === severity, `Expected error severity to be "${severity}"`);
  }

  /**
   * Checks the expected error severity and throws an error if the actual severity does match.
   *
   * @param severity The error severity expected to not be present.
   * @returns The current TestValidationFailures instance.
   * @throws An error if the actual severity does match the expected severity.
   */
  public withoutSeverity(severity: Severity): this {
    return this.with(failure => failure.severity !== severity, `Expected no error severity to be "${severity}"`);
  }

  /**
   * Checks the expected error custom state and throws an error if the actual custom state does not match.
   *
   * @param customState The expected custom state.
   * @param equalityFn *optional* The function used to compare the custom state.
   * @returns An error if the actual custom state does not match the expected custom state.
   */
  public withCustomState(customState: unknown, equalityFn: ValueEqualityFn<unknown> = defaultEqualityFn): this {
    return this.with(
      failure => equalityFn(failure.customState, customState),
      `Expected custom state to be "${JSON.stringify(customState)}"`
    );
  }

  /**
   * Checks the expected error custom state and throws an error if the actual custom state does match.
   *
   * @param customState The custom state expected to not be present.
   * @param equalityFn *optional* The function used to compare the custom state.
   * @returns The current TestValidationFailures instance.
   * @throws An error if the actual custom state does match the expected custom state.
   */
  public withoutCustomState(customState: unknown, equalityFn: ValueEqualityFn<unknown> = defaultEqualityFn): this {
    return this.with(
      failure => !equalityFn(failure.customState, customState),
      `Expected no custom state to be "${JSON.stringify(customState)}"`
    );
  }

  private with(predicate: (failure: ValidationFailure) => boolean, message: string): this {
    if (this.some(failure => predicate(failure)) === false) {
      throw new TestValidationError(message);
    }
    return this;
  }
}
