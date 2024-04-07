import { NumberProperty } from '../../models';
import { AbstractRule } from '../rule';

export class IsNegativeRule<T, P extends NumberProperty> extends AbstractRule<T, P> {
  public override errorMessage = '{{propertyName}} must be a negative number';

  constructor() {
    // TODO #1 handle undefined value
    super(value => (value || 0) < 0);
  }
}
