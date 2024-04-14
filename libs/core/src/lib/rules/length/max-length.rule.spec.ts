import { createPersonWith } from '../../testing/test-data';
import { Person } from '../../testing/test-models';
import { createValidator } from '../../create-validator';
import { MaxLengthRule } from './max-length.rule';

describe(MaxLengthRule.name, () => {
  const validator = createValidator<Person>(val => val.ruleFor('name').maxLength(3));

  it('should return an error if the value is longer than the maximum length', () => {
    const result = validator.validate(createPersonWith({ name: 'abcd' }));
    expect(result.isValid).toBeFalsy();
    expect(result.errors).toHaveLength(1);
    expect(result.errors[0].message).toBe('name must have a maximum length of 3.');
  });

  it('should not return an error if the value is equal to the maximum length', () => {
    const result = validator.validate(createPersonWith({ name: 'abc' }));
    expect(result.isValid).toBeTruthy();
    expect(result.errors).toHaveLength(0);
  });

  it('should not return an error if the value is shorter than the maximum length', () => {
    const result = validator.validate(createPersonWith({ name: 'ab' }));
    expect(result.isValid).toBeTruthy();
    expect(result.errors).toHaveLength(0);
  });

  it('should fall back to `0` if the value is nullish', () => {
    const fallbackValidator = createValidator<Person>(val => val.ruleFor('name').maxLength(-1));
    const result = fallbackValidator.validate(createPersonWith({ name: null as unknown as string }));
    expect(result.isValid).toBeFalsy();
    expect(result.errors).toHaveLength(1);
    expect(result.errors[0].message).toBe('name must have a maximum length of -1.');
  });
});
