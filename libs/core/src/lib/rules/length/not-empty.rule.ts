import { LengthProperty } from '../../models';
import { AbstractRule } from '../rule';

export class NotEmptyRule<T, P extends LengthProperty> extends AbstractRule<T, P> {
  public override name = NotEmptyRule.name;

  constructor() {
    super(value => {
      return (value?.length || 0) > 0;
    });
  }
}
