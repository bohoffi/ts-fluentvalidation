import { AbstractPropertyValidator } from '../abstract-property-validator';
import { ValidationContext } from '../validation-context';
import { ValidatorSelector } from './validator-selector';

/**
 * Represents a composite validator selector that combines multiple validator selectors.
 */
export class CompositeValidatorSelector implements ValidatorSelector {
  constructor(private readonly selectors: ValidatorSelector[]) {}

  /**
   * Determines whether the specified validator can be executed based on the given parameters.
   * @param validator - The validator to check.
   * @param propertyPath - The property path being validated.
   * @param validationContext - The validation context.
   * @returns `true` if the validator can be executed, otherwise `false`.
   */
  public canExecute<T, P>(
    validator: AbstractPropertyValidator<T, P>,
    propertyPath: string,
    validationContext: ValidationContext<T>
  ): boolean {
    return this.selectors.every(selector => selector.canExecute(validator, propertyPath, validationContext));
  }
}
