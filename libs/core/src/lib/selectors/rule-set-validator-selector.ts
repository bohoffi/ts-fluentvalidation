import { AbstractPropertyValidator } from '../abstract-property-validator';
import { ValidationContext } from '../validation-context';
import { ValidatorSelector } from './validator-selector';

export class RuleSetValidatorSelector implements ValidatorSelector {
  public canExecute<T, P>(
    validator: AbstractPropertyValidator<T, P>,
    propertyPath: string,
    validationContext: ValidationContext<T>
  ): boolean {
    throw new Error('Method not implemented.');
  }
}
