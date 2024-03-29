import { AbstractRule } from '../rule';

export class IsNotNullRule<T, P> extends AbstractRule<T, P> {
  public override errorMessage = '{{propertyName}} must not be null';

  constructor() {
    super(value => value !== null);
  }
}
