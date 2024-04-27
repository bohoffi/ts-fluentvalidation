import { CascadeMode } from './models';
import { AbstractRule } from './rules/rule';
import { KeyOf } from './ts-helpers';

/**
 * Represents an abstract base class for property validators.
 *
 * @typeParam T - The type of the object being validated.
 * @typeParam P - The type of the property being validated.
 */
export abstract class AbstractPropertyValidator<T, P> {
  /**
   * Represents the collection of property rules for a validator.
   */
  public readonly propertyRules: AbstractRule<T, P>[] = [];
  /**
   * Specifies the cascade mode for the property validator.
   * The cascade mode determines how validation should proceed when a validation failure occurs.
   * Possible values are:
   * - 'Continue': Continue validating all rules for the property, even if a validation failure occurs.
   * - 'Stop': Stop validating the property after the first validation failure occurs.
   */
  protected cascadeMode: CascadeMode = 'Continue';

  constructor(public readonly propertyName: KeyOf<T>) {}

  /**
   * Adds a rule to the property validator.
   * @param rule The rule to add.
   */
  public addRule(rule: AbstractRule<T, P>): void {
    this.propertyRules.push(rule);
  }

  /**
   * Sets the cascade mode for the validator.
   * @param cascadeMode The cascade mode to set.
   */
  public cascade(cascadeMode: CascadeMode): void {
    this.cascadeMode = cascadeMode;
  }
}
