import { MessageFormatter } from '../../message-formatter';
import { AbstractRule } from '../rule';

/**
 * Represents a rule that checks if a property value is equal to a specified comparison value.
 *
 * @typeParam T - The type of the object being validated.
 * @typeParam P - The type of the property being validated.
 */
export class EqualRule<T, P> extends AbstractRule<T, P> {
  public override errorMessage = '{propertyName} must be equal to {comparisonValue}.';

  constructor(private readonly comparisonValue: P) {
    super(value => value === comparisonValue);
  }

  public override appendArguments(messageFormatter: MessageFormatter): void {
    messageFormatter.appendArgument('comparisonValue', this.comparisonValue);
  }
}
