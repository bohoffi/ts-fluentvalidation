import { MessageFormatter } from '../../message-formatter';
import { LengthProperty } from '../../models';
import { AbstractRule } from '../rule';

export class LengthRule<T, P extends LengthProperty> extends AbstractRule<T, P> {
  public override errorMessage = '{propertyName} must have a minimum length of {minLength} and a maximum length of {maxLength}.';

  constructor(private readonly minLength: number, private readonly maxLength: number) {
    super(value => {
      const length = value?.length || 0;
      return length >= this.minLength && length <= this.maxLength;
    });
  }

  public override appendArguments(messageFormatter: MessageFormatter): void {
    messageFormatter.appendArgument('minLength', this.minLength);
    messageFormatter.appendArgument('maxLength', this.maxLength);
  }
}
