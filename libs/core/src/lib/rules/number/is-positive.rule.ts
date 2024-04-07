import { NumberProperty } from '../../models';
import { AbstractRule } from '../rule';

export class IsPositiveRule<T, P extends NumberProperty> extends AbstractRule<T, P> {
  public override errorMessage = '{{propertyName}} must be a positive number';

  constructor() {
    // TODO #1 handle undefined value
    super(value => (value || 0) > 0);
  }
}
