import { createPersonWith } from '../../testing/test-data';
import { Person } from '../../testing/test-models';
import { createValidator } from '../../validator';
import { MustRule } from './must.rule';

describe(MustRule.name, () => {
  const validator = createValidator<Person>(val => val.ruleFor('name').must(val => val === 'abc'));

  it('should not return an error if the value passes the predicate', () => {
    const result = validator.validate(createPersonWith({ name: 'abc' }));
    expect(result.isValid).toBeTruthy();
    expect(result.failures).toHaveLength(0);
  });

  it('should return an error if the value does not pass the predicate', () => {
    const result = validator.validate(createPersonWith({ name: 'def' }));
    expect(result.isValid).toBeFalsy();
    expect(result.failures).toHaveLength(1);
    expect(result.failures[0].message).toBe('Condition for name was not met');
  });
});
