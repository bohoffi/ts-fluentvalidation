import { createPersonWith } from '../../testing/test-data';
import { Person } from '../../testing/test-models';
import { createValidator } from '../../create-validator';
import { EmptyRule } from './empty.rule';

describe(EmptyRule.name, () => {
  const validator = createValidator<Person>(val => val.ruleFor('name').empty());

  it('should not return an error if the value is an empty string', () => {
    const result = validator.validate(createPersonWith({ name: '' }));
    expect(result.isValid).toBeTruthy();
    expect(result.errors).toHaveLength(0);
  });

  it('should return an error if the value is a non-empty string', () => {
    const result = validator.validate(createPersonWith({ name: 'abc' }));
    expect(result.isValid).toBeFalsy();
    expect(result.errors).toHaveLength(1);
    expect(result.errors[0].message).toBe('name must be empty.');
  });
});
