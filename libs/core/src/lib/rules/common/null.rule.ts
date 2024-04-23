import { AbstractRule } from '../rule';

export class NullRule<T, P> extends AbstractRule<T, P> {
  public override name = NullRule.name;

  constructor() {
    super(value => value === null);
  }
}
