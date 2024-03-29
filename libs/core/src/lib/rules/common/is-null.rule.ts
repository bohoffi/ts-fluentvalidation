import { AbstractRule } from '../rule';

export class IsNullRule<T, P> extends AbstractRule<T, P> {
  public override errorMessage = '{{propertyName}} must be null';

  constructor() {
    super(value => value === null);
  }
}
