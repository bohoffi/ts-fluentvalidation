import { ValidationFailure } from '../../lib/result/validation-failure';
import { ValidationResult } from '../../lib/result/validation-result';
import { IndexedArrayKeyOf, IndexedNestedArrayKeyOf, KeyOf, NestedKeyOf } from '../../lib/types';
import { TestValidationError } from './test-validation-error';
import { TestValidationFailures } from './test-validation-failure';

/**
 * Represents a test validation result.
 * Extends the base ValidationResult.
 * Provides additional methods for validating errors.
 *
 * @template T - The type of the object being validated.
 */
export class TestValidationResult<T extends object> implements ValidationResult {
  public get isValid(): boolean {
    return this.validationResult.isValid;
  }
  public get failures(): ValidationFailure[] {
    return this.validationResult.failures;
  }

  constructor(private readonly validationResult: ValidationResult) {}

  public addFailures(...validationFailures: ValidationFailure[]): void {
    this.validationResult.addFailures(...validationFailures);
  }

  public toString(separator = '\n') {
    return this.validationResult.toString(separator);
  }

  public toDictionary() {
    return this.validationResult.toDictionary();
  }

  /**
   * Validates that a validation error should exist for the specified property.
   *
   * @param propertyName - The property name to check.
   * @throws {@link TestValidationError} if there is no validation error for the specified property.
   * @returns The TestValidationFailures for the specified property.
   */
  public shouldHaveValidationErrorFor(propertyName: string): TestValidationFailures;
  public shouldHaveValidationErrorFor(
    propertyName: KeyOf<T> | IndexedArrayKeyOf<T> | NestedKeyOf<T> | IndexedNestedArrayKeyOf<T>
  ): TestValidationFailures;
  public shouldHaveValidationErrorFor(
    propertyName: string | KeyOf<T> | IndexedArrayKeyOf<T> | NestedKeyOf<T> | IndexedNestedArrayKeyOf<T>
  ): TestValidationFailures {
    const validationFailures = this.failures.filter(failure => failure.propertyName === propertyName);
    if (validationFailures.length) {
      return new TestValidationFailures(...validationFailures);
    }

    throw new TestValidationError(`Expected a validation error for property ${propertyName}`);
  }

  /**
   * Asserts that the validation result should not have a validation error for the specified property.
   *
   * @param propertyName - The property name to validate.
   * @throws {@link TestValidationError} if there is a validation error for the specified property.
   * @returns The current TestValidationResult instance.
   */
  public shouldNotHaveValidationErrorFor(propertyName: string): this;
  public shouldNotHaveValidationErrorFor(propertyName: KeyOf<T> | IndexedArrayKeyOf<T> | NestedKeyOf<T> | IndexedNestedArrayKeyOf<T>): this;
  public shouldNotHaveValidationErrorFor(
    propertyName: string | KeyOf<T> | IndexedArrayKeyOf<T> | NestedKeyOf<T> | IndexedNestedArrayKeyOf<T>
  ): this {
    if (this.failures.some(failure => failure.propertyName === propertyName)) {
      throw new TestValidationError(`Expected no validation error for property ${propertyName}`);
    }
    return this;
  }
}
