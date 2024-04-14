import { MessageFormatter } from '../../message-formatter';
import { LengthProperty } from '../../models';
import { AbstractRule } from '../rule';

export class MinLengthRule<T, P extends LengthProperty> extends AbstractRule<T, P> {
  public override errorMessage = '{propertyName} must have a minimum length of {minLength}.';

  constructor(private readonly minLength: number) {
    super(value => {
      return (value?.length || 0) >= this.minLength;
    });
  }

  public override appendArguments(messageFormatter: MessageFormatter): void {
    messageFormatter.appendArgument('minLength', this.minLength);
  }
}
