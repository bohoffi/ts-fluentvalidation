import { MessageFormatter } from '../../message-formatter';
import { NumberProperty } from '../../models';
import { AbstractRule } from '../rule';

export class LessThanRule<T, P extends NumberProperty> extends AbstractRule<T, P> {
  public override errorMessage = '{propertyName} must be less than {comparisonValue}.';

  constructor(private readonly referenceValue: number) {
    super(value => {
      return (value || 0) < this.referenceValue;
    });
  }

  public override appendArguments(messageFormatter: MessageFormatter): void {
    messageFormatter.appendArgument('comparisonValue', this.referenceValue);
  }
}
