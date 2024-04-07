import { MessageFormatter } from '../../message-formatter';
import { AbstractRule } from '../rule';

export class NotEqualsRule<T, P> extends AbstractRule<T, P> {
  public override errorMessage = '{{propertyName}} must not be equal to {{comparisonValue}}';

  constructor(private readonly comparisonValue: P) {
    super(value => value !== comparisonValue);
  }

  public override appendArguments(messageFormatter: MessageFormatter): void {
    messageFormatter.appendArgument('comparisonValue', this.comparisonValue);
  }
}
