import { LengthProperty } from '../../models';
import { AbstractRule } from '../rule';

export class EmptyRule<T, P extends LengthProperty> extends AbstractRule<T, P> {
  public override name = EmptyRule.name;

  constructor() {
    super(value => {
      return (value?.length || 0) === 0;
    });
  }
}
