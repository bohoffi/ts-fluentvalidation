import { AbstractPropertyValidator } from '../abstract-property-validator';
import { ValidationContext } from '../validation-context';
import { ValidatorSelector } from './validator-selector';

/**
 * Represents a default validator selector that will execute all rules that do not belong to a rule set.
 */
export class DefaultValidatorSelector implements ValidatorSelector {
  public canExecute<T, P>(
    validator: AbstractPropertyValidator<T, P>,
    propertyPath: string,
    validationContext: ValidationContext<T>
  ): boolean {
    // TODO #16 check against rule sets
    return true;
  }
}
