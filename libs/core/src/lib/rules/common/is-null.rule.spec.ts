import { createPersonWith } from '../../testing/test-data';
import { Person } from '../../testing/test-models';
import { createValidator } from '../../validator';
import { IsNullRule } from './is-null.rule';

describe(IsNullRule.name, () => {
  const validator = createValidator<Person>(val => val.ruleFor('name').isNull());

  it('should not return an error if the value is null', () => {
    const result = validator.validate(createPersonWith({ name: null } as unknown as Partial<Person>));
    expect(result.isValid).toBeTruthy();
    expect(result.failures).toHaveLength(0);
  });

  it('should return an error if the value is not null', () => {
    const result = validator.validate(createPersonWith({ name: 'abc' }));
    expect(result.isValid).toBeFalsy();
    expect(result.failures).toHaveLength(1);
    expect(result.failures[0].message).toBe('name must be null');
  });
});
