import { createPersonWith } from '../../testing/test-data';
import { Person } from '../../testing/test-models';
import { createValidator } from '../../validator';
import { IsNegativeRule } from './is-negative.rule';

describe(IsNegativeRule.name, () => {
  const validator = createValidator<Person>(val => val.ruleFor('age').isNegative());

  it('should not return an error if the value is a negative number', () => {
    const result = validator.validate(createPersonWith({ age: -1 }));
    expect(result.isValid).toBeTruthy();
    expect(result.failures).toHaveLength(0);
  });

  it('should return an error if the value is a positive number', () => {
    const result = validator.validate(createPersonWith({ age: 1 }));
    expect(result.isValid).toBeFalsy();
    expect(result.failures).toHaveLength(1);
    expect(result.failures[0].message).toBe('age must be a negative number');
  });

  it('should return an error if the value is zero', () => {
    const result = validator.validate(createPersonWith({ age: 0 }));
    expect(result.isValid).toBeFalsy();
    expect(result.failures).toHaveLength(1);
    expect(result.failures[0].message).toBe('age must be a negative number');
  });
});
