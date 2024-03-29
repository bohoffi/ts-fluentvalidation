import { LengthProperty } from '../../models';
import { AbstractRule } from '../rule';

export class EmptyRule<T, P extends LengthProperty> extends AbstractRule<T, P> {
  public override errorMessage = '{{propertyName}} must be empty';

  constructor() {
    super(value => {
      // TODO #1 handle undefined value
      return value?.length === 0;
    });
  }
}
