import { MessageFormatter } from '../../message-formatter';
import { LengthProperty } from '../../models';
import { AbstractRule } from '../rule';

export class MaxLengthRule<T, P extends LengthProperty> extends AbstractRule<T, P> {
  public override name = MaxLengthRule.name;

  constructor(private readonly maxLength: number) {
    super(value => {
      return (value?.length || 0) <= this.maxLength;
    });
  }

  public override appendArguments(messageFormatter: MessageFormatter): void {
    messageFormatter.appendOrUpdateArgument('maxLength', this.maxLength);
  }
}
