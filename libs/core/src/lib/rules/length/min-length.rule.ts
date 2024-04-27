import { MessageFormatter } from '../../message-formatter';
import { LengthProperty } from '../../models';
import { AbstractRule } from '../rule';

export class MinLengthRule<T, P extends LengthProperty> extends AbstractRule<T, P> {
  public override name = MinLengthRule.name;

  constructor(private readonly minLength: number) {
    super(value => {
      return (value?.length || 0) >= this.minLength;
    });
  }

  public override appendArguments(messageFormatter: MessageFormatter): void {
    messageFormatter.appendOrUpdateArgument('minLength', this.minLength);
  }
}
