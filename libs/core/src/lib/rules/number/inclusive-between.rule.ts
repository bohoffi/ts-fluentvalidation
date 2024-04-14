import { MessageFormatter } from '../../message-formatter';
import { NumberProperty } from '../../models';
import { AbstractRule } from '../rule';

export class InclusiveBetweenRule<T, P extends NumberProperty> extends AbstractRule<T, P> {
  public override errorMessage = '{propertyName} must be between {lowerBound} and {upperBound}.';

  constructor(private readonly lowerBound: number, private readonly upperBound: number) {
    super(value => {
      return (value || 0) >= this.lowerBound && (value || 0) <= this.upperBound;
    });
  }

  public override appendArguments(messageFormatter: MessageFormatter): void {
    messageFormatter.appendArgument('lowerBound', this.lowerBound);
    messageFormatter.appendArgument('upperBound', this.upperBound);
  }
}
