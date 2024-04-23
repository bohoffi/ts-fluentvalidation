import { RulePredicate } from '../../models';
import { AbstractRule } from '../rule';

export class MustRule<T, P> extends AbstractRule<T, P> {
  public override name = MustRule.name;

  constructor(private readonly predicate: RulePredicate<T, P>) {
    super((value, validationContext) => this.predicate(value, validationContext.instanceToValidate, validationContext));
  }
}
