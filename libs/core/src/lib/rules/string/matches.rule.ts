import { StringProperty } from '../../models';
import { MessageFormatter } from '../../message-formatter';
import { AbstractRule } from '../rule';

export class MatchesRule<T, P extends StringProperty> extends AbstractRule<T, P> {
  public override errorMessage = '{{propertyName}} must match the pattern {{pattern}}';

  constructor(private readonly pattern: RegExp) {
    // TODO handle undefined value
    super(value => this.pattern.test(value || ''));
  }

  public override appendArguments(messageFormatter: MessageFormatter): void {
    messageFormatter.appendArgument('pattern', this.pattern.toString());
  }
}
