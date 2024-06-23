import { AbstractPropertyValidator } from '../abstract-property-validator';
import { ValidationContext } from '../validation-context';

/**
 * Represents a selector for validating properties.
 */
export interface ValidatorSelector {
  /**
   * Determines whether the specified validator can be executed for the given property.
   *
   * @param validator - The validator to check.
   * @param propertyPath - The path of the property being validated.
   * @param validationContext - The validation context.
   * @returns `true` if the validator can be executed, otherwise `false`.
   */
  canExecute<T, P>(validator: AbstractPropertyValidator<T, P>, propertyPath: string, validationContext: ValidationContext<T>): boolean;
}
