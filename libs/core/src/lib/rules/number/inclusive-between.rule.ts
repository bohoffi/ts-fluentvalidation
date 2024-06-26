import { MessageFormatter } from '../../message-formatter';
import { NumberProperty } from '../../models';
import { AbstractRule } from '../rule';

export class InclusiveBetweenRule<T, P extends NumberProperty> extends AbstractRule<T, P> {
  public override name = InclusiveBetweenRule.name;

  constructor(private readonly lowerBound: number, private readonly upperBound: number) {
    super(value => {
      return (value || 0) >= this.lowerBound && (value || 0) <= this.upperBound;
    });
  }

  public override appendArguments(messageFormatter: MessageFormatter): void {
    messageFormatter.appendOrUpdateArgument('lowerBound', this.lowerBound);
    messageFormatter.appendOrUpdateArgument('upperBound', this.upperBound);
  }
}
