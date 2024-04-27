import { MessageFormatter } from '../../message-formatter';
import { AbstractRule } from '../rule';

export class NotEqualRule<T, P> extends AbstractRule<T, P> {
  public override name = NotEqualRule.name;

  constructor(private readonly comparisonValue: P) {
    super(value => value !== comparisonValue);
  }

  public override appendArguments(messageFormatter: MessageFormatter): void {
    messageFormatter.appendOrUpdateArgument('comparisonValue', this.comparisonValue);
  }
}
