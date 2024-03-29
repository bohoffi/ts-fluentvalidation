import { createPersonWith } from '../../testing/test-data';
import { Person } from '../../testing/test-models';
import { createValidator } from '../../validator';
import { MaxLengthRule } from './max-length.rule';

describe(MaxLengthRule.name, () => {
  const validator = createValidator<Person>(val => val.ruleFor('name').maxLength(3));

  it('should return an error if the value is longer than the maximum length', () => {
    const result = validator.validate(createPersonWith({ name: 'abcd' }));
    expect(result.isValid).toBeFalsy();
    expect(result.failures).toHaveLength(1);
    expect(result.failures[0].message).toBe('name must have a maximum length of 3');
  });

  it('should not return an error if the value is equal to the maximum length', () => {
    const result = validator.validate(createPersonWith({ name: 'abc' }));
    expect(result.isValid).toBeTruthy();
    expect(result.failures).toHaveLength(0);
  });

  it('should not return an error if the value is shorter than the maximum length', () => {
    const result = validator.validate(createPersonWith({ name: 'ab' }));
    expect(result.isValid).toBeTruthy();
    expect(result.failures).toHaveLength(0);
  });
});
