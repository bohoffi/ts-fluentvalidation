import { AsyncRulePredicate } from '../../models';
import { AbstractAsyncRule } from '../rule';

export class AsyncMustRule<T, P> extends AbstractAsyncRule<T, P> {
  public override name = AsyncMustRule.name;

  constructor(private readonly predicate: AsyncRulePredicate<T, P>) {
    super((value, validationContext) => this.predicate(value, validationContext.instanceToValidate, validationContext));
  }
}
