import { createPersonWith } from '../../testing/test-data';
import { Person } from '../../testing/test-models';
import { createValidator } from '../../validator';
import { NotEmptyRule } from './not-empty.rule';

describe(NotEmptyRule.name, () => {
  const validator = createValidator<Person>(val => val.ruleFor('name').notEmpty());

  it('should return an error if the value is an empty string', () => {
    const result = validator.validate(createPersonWith({ name: '' }));
    expect(result.isValid).toBeFalsy();
    expect(result.failures).toHaveLength(1);
    expect(result.failures[0].message).toBe('name must not be empty');
  });

  it('should not return an error if the value is a non-empty string', () => {
    const result = validator.validate(createPersonWith({ name: 'abc' }));
    expect(result.isValid).toBeTruthy();
    expect(result.failures).toHaveLength(0);
  });
});
