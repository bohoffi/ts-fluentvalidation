import { AbstractRule } from '../rule';

/**
 * Represents a validation rule that checks if a value is not null.
 *
 * @typeParam T - The type of the value being validated.
 * @typeParam P - The type of the property being validated.
 */
export class NotNullRule<T, P> extends AbstractRule<T, P> {
  public override name = NotNullRule.name;

  constructor() {
    super(value => value !== null);
  }
}
