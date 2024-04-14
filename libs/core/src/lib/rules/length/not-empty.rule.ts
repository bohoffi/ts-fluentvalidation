import { LengthProperty } from '../../models';
import { AbstractRule } from '../rule';

export class NotEmptyRule<T, P extends LengthProperty> extends AbstractRule<T, P> {
  public override errorMessage = '{propertyName} must not be empty.';

  constructor() {
    super(value => {
      return (value?.length || 0) > 0;
    });
  }
}
