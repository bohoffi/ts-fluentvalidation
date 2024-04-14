import { StringProperty } from '../../models';
import { AbstractRule } from '../rule';

export class MatchesRule<T, P extends StringProperty> extends AbstractRule<T, P> {
  public override errorMessage = '{propertyName} is not in the correct format.';

  constructor(private readonly pattern: RegExp) {
    super(value => this.pattern.test(value || ''));
  }
}
