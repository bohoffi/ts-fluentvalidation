import { createPersonWith } from '../../testing/test-data';
import { Person } from '../../testing/test-models';
import { createValidator } from '../../create-validator';
import { LengthRule } from './length.rule';

describe(LengthRule.name, () => {
  const validator = createValidator<Person>(val => val.ruleFor('name').length(3, 5));

  it('should return an error if the value is longer than the maximum length', () => {
    const result = validator.validate(createPersonWith({ name: 'abcdef' }));
    expect(result.isValid).toBeFalsy();
    expect(result.errors).toHaveLength(1);
    expect(result.errors[0].message).toBe('name must have a minimum length of 3 and a maximum length of 5.');
  });

  it('should return an error if the value is shorter than the minimum length', () => {
    const result = validator.validate(createPersonWith({ name: 'ab' }));
    expect(result.isValid).toBeFalsy();
    expect(result.errors).toHaveLength(1);
    expect(result.errors[0].message).toBe('name must have a minimum length of 3 and a maximum length of 5.');
  });

  it('should not return an error if the value is inside the min max range', () => {
    const result = validator.validate(createPersonWith({ name: 'abcd' }));
    expect(result.isValid).toBeTruthy();
    expect(result.errors).toHaveLength(0);
  });

  it('should fall back to `0` if the value is nullish', () => {
    const result = validator.validate(createPersonWith({ name: null as unknown as string }));
    expect(result.isValid).toBeFalsy();
    expect(result.errors).toHaveLength(1);
    expect(result.errors[0].message).toBe('name must have a minimum length of 3 and a maximum length of 5.');
  });
});
