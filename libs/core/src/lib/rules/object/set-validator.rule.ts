import { ObjectProperty, ValidatorContract } from '../../models';
import { ValidationContext } from '../../validation-context';
import { AbstractRule } from '../rule';

/**
 * Represents a rule that applies a validator to a property of an object.
 * @typeParam T The type of the object being validated.
 * @typeParam P The type of the property being validated.
 */
export class SetValidatorRule<T, P extends ObjectProperty> extends AbstractRule<T, P> {
  public override name = SetValidatorRule.name;
  /**
   * Creates a new instance of the SetValidatorRule class.
   * @param validator - The validator to apply to the property.
   */
  constructor(private readonly validator: ValidatorContract<P>) {
    super(() => true);
  }

  /**
   * Validates the specified property value.
   * @param value - The value of the property being validated.
   * @param validationContext - The validation context.
   * @returns A boolean indicating whether the property value is valid.
   */
  public override validate(value: P, validationContext: ValidationContext<T>): boolean {
    if (!value) {
      return true;
    }

    const validationResult = this.validator.validate(value);

    if (!validationResult.isValid) {
      validationResult.errors.forEach(failure => {
        failure.propertyName = `${validationContext.propertyPath}.${failure.propertyName}`;
        validationContext.addFailure(failure);
      });
    }

    return validationResult.isValid;
  }
}
