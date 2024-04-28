import { createPersonWith } from '../../testing/test-data';
import { Person } from '../../testing/test-models';
import { createValidator } from '../../create-validator';
import { MinLengthRule } from './min-length.rule';
import { testValidate } from '../../../testing';

describe(MinLengthRule.name, () => {
  const validator = createValidator<Person>(val => val.ruleFor('name').minLength(3));

  it('should return an error if the value is shorter than the minimum length', () => {
    const result = testValidate(validator, createPersonWith({ name: 'ab' }));
    expect(result.isValid).toBeFalsy();
    expect(result.errors).toHaveLength(1);
    result.shouldHaveValidationErrorFor(p => p.name).withMessage('name must have a minimum length of 3.');
  });

  it('should not return an error if the value is equal to the minimum length', () => {
    const result = testValidate(validator, createPersonWith({ name: 'abc' }));
    expect(result.isValid).toBeTruthy();
    expect(result.errors).toHaveLength(0);
  });

  it('should not return an error if the value is longer than the minimum length', () => {
    const result = testValidate(validator, createPersonWith({ name: 'abcd' }));
    expect(result.isValid).toBeTruthy();
    expect(result.errors).toHaveLength(0);
  });

  it('should fall back to `0` if the value is nullish', () => {
    const result = testValidate(validator, createPersonWith({ name: null as unknown as string }));
    expect(result.isValid).toBeFalsy();
    expect(result.errors).toHaveLength(1);
    result.shouldHaveValidationErrorFor(p => p.name).withMessage('name must have a minimum length of 3.');
  });
});
