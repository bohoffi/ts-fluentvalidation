import { createPersonWith } from '../../testing/test-data';
import { Person } from '../../testing/test-models';
import { createValidator } from '../../validator';
import { LessThanRule } from './less-than.rule';

describe(LessThanRule.name, () => {
  const referenceValue = 10;
  const validator = createValidator<Person>(val => val.ruleFor('age').lessThan(referenceValue));

  it('should not return an error if the value is less than the reference value', () => {
    const result = validator.validate(createPersonWith({ age: referenceValue - 1 }));
    expect(result.isValid).toBeTruthy();
    expect(result.failures).toHaveLength(0);
  });

  it('should return an error if the value is equal to the reference value', () => {
    const result = validator.validate(createPersonWith({ age: referenceValue }));
    expect(result.isValid).toBeFalsy();
    expect(result.failures).toHaveLength(1);
    expect(result.failures[0].message).toBe('age must be less than 10');
  });

  it('should return an error if the value is greater than the reference value', () => {
    const result = validator.validate(createPersonWith({ age: referenceValue + 1 }));
    expect(result.isValid).toBeFalsy();
    expect(result.failures).toHaveLength(1);
    expect(result.failures[0].message).toBe('age must be less than 10');
  });
});