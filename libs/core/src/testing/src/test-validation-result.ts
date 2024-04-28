import { TestValidationFailures } from './test-validation-failure';
import { MemberExpression } from '../../lib/models';
import { PropertyChain } from '../../lib/property-chain';
import { ValidationResult } from '../../lib/result';
import { KeyOf } from '../../lib/ts-helpers';
import { TestValidationError } from './test-validation-error';

/**
 * Represents a test validation result.
 * Extends the base ValidationResult class.
 * Provides additional methods for validating errors.
 *
 * @template T - The type of the object being validated.
 */
export class TestValidationResult<T extends object> extends ValidationResult {
  constructor(validationResult: ValidationResult) {
    super(validationResult.errors);
  }

  /**
   * Validates that a validation error should exist for the specified property.
   *
   * @param memberExpressionOrPropertyName - The member expression or property name to validate.
   * @throws {@link TestValidationError} if there is no validation error for the specified property.
   * @returns The TestValidationFailures for the specified property.
   */
  public shouldHaveValidationErrorFor<V>(
    memberExpressionOrPropertyName: MemberExpression<T, V> | KeyOf<T> | string
  ): TestValidationFailures {
    const propertyName =
      typeof memberExpressionOrPropertyName === 'function'
        ? PropertyChain.fromExpression(memberExpressionOrPropertyName).toString()
        : memberExpressionOrPropertyName;

    return this.shouldHaveValidationError(propertyName);
  }

  /**
   * Asserts that the validation result should not have a validation error for the specified property.
   *
   * @param memberExpressionOrPropertyName - The member expression or property name to validate.
   * @throws {@link TestValidationError} if there is a validation error for the specified property.
   * @returns The current TestValidationResult instance.
   */
  public shouldNotHaveValidationErrorFor<V>(memberExpressionOrPropertyName: MemberExpression<T, V> | KeyOf<T>): this {
    const propertyName =
      typeof memberExpressionOrPropertyName === 'function'
        ? PropertyChain.fromExpression(memberExpressionOrPropertyName).toString()
        : memberExpressionOrPropertyName;

    return this.shouldNotHaveValidationError(propertyName);
  }

  private shouldHaveValidationError(propertyName: string): TestValidationFailures {
    const validationFailures = this.errors.filter(failure => failure.propertyName === propertyName);
    if (validationFailures.length) {
      return TestValidationFailures.fromValidationFailures(validationFailures);
    }

    throw new TestValidationError(`Expected a validation error for property ${propertyName}`);
  }

  private shouldNotHaveValidationError(propertyName: string): this {
    if (this.errors.some(failure => failure.propertyName === propertyName)) {
      throw new TestValidationError(`Expected no validation error for property ${propertyName}`);
    }
    return this;
  }
}
