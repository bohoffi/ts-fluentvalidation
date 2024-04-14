import { createPersonWith } from '../../testing/test-data';
import { Person } from '../../testing/test-models';
import { createValidator } from '../../create-validator';
import { MustRule } from './must.rule';
import { RulePredicate } from '../../models';

describe(MustRule.name, () => {
  const validator = createValidator<Person>(val => val.ruleFor('name').must(val => val === 'abc'));

  it('should not return an error if the value passes the predicate', () => {
    const result = validator.validate(createPersonWith({ name: 'abc' }));
    expect(result.isValid).toBeTruthy();
    expect(result.errors).toHaveLength(0);
  });

  it('should return an error if the value does not pass the predicate', () => {
    const result = validator.validate(createPersonWith({ name: 'def' }));
    expect(result.isValid).toBeFalsy();
    expect(result.errors).toHaveLength(1);
    expect(result.errors[0].message).toBe('The specified condition was not met for name.');
  });

  it('should return an error if the value does not pass the custom rule', () => {
    function arrayMustContainFewerThan<T, P extends unknown[]>(num: number): RulePredicate<T, P> {
      return (value, _, validationContext) => {
        validationContext.messageFormatter.appendArgument('maxElements', num);
        return value.length < num;
      };
    }

    const customRuleValidator = createValidator<Person>(val =>
      val
        .ruleFor(p => p.pets)
        .must(arrayMustContainFewerThan(3))
        .withMessage('{propertyName} must contain fewer than {maxElements} items.')
    );
    const result = customRuleValidator.validate(createPersonWith({ pets: [1, 2, 3] }));
    expect(result.isValid).toBeFalsy();
    expect(result.errors).toHaveLength(1);
    expect(result.errors[0].message).toBe('pets must contain fewer than 3 items.');
  });
});
