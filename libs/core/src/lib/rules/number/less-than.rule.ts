import { MessageFormatter } from '../../message-formatter';
import { NumberProperty } from '../../models';
import { AbstractRule } from '../rule';

export class LessThanRule<T, P extends NumberProperty> extends AbstractRule<T, P> {
  public override name = LessThanRule.name;

  constructor(private readonly referenceValue: number) {
    super(value => {
      return (value || 0) < this.referenceValue;
    });
  }

  public override appendArguments(messageFormatter: MessageFormatter): void {
    messageFormatter.appendOrUpdateArgument('comparisonValue', this.referenceValue);
  }
}
