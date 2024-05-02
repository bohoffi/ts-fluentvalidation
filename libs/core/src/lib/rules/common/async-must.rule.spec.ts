import { createPersonWith } from '../../testing/test-data';
import { Person } from '../../testing/test-models';
import { createValidator } from '../../create-validator';
import { AsyncMustRule } from './async-must.rule';
import { AsyncRulePredicate } from '../../models';
import { testValidateAsync } from '../../../testing';

describe(AsyncMustRule.name, () => {
  const validator = createValidator<Person>(val => val.ruleFor('name').mustAsync(val => Promise.resolve(val === 'abc')));

  it('should not return an error if the value passes the predicate', async () => {
    const result = await testValidateAsync(validator, createPersonWith({ name: 'abc' }));
    expect(result.isValid).toBeTruthy();
    expect(result.errors).toHaveLength(0);
  });

  it('should return an error if the value does not pass the predicate', async () => {
    const result = await testValidateAsync(validator, createPersonWith({ name: 'def' }));
    expect(result.isValid).toBeFalsy();
    expect(result.errors).toHaveLength(1);
    result.shouldHaveValidationErrorFor(p => p.name).withMessage('The specified condition was not met for name.');
  });

  it('should return an error if the value does not pass the custom rule', async () => {
    function arrayMustContainFewerThan<T, P extends unknown[]>(num: number): AsyncRulePredicate<T, P> {
      return (value, _, validationContext) => {
        validationContext.messageFormatter.appendOrUpdateArgument('maxElements', num);
        return Promise.resolve(value.length < num);
      };
    }

    const customRuleValidator = createValidator<Person>(val =>
      val
        .ruleFor(p => p.pets)
        .mustAsync(arrayMustContainFewerThan(3))
        .withMessage('{propertyName} must contain fewer than {maxElements} items.')
    );
    const result = await testValidateAsync(customRuleValidator, createPersonWith({ pets: ['dog', 'cat', 'fish'] }));
    expect(result.isValid).toBeFalsy();
    expect(result.errors).toHaveLength(1);
    result.shouldHaveValidationErrorFor(p => p.pets).withMessage('pets must contain fewer than 3 items.');
  });
});
