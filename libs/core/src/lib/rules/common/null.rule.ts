import { AbstractRule } from '../rule';

export class NullRule<T, P> extends AbstractRule<T, P> {
  public override errorMessage = '{propertyName} must be null.';

  constructor() {
    super(value => value === null);
  }
}
