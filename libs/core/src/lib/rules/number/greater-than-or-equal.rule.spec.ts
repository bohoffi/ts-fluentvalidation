import { createPersonWith } from '../../testing/test-data';
import { Person } from '../../testing/test-models';
import { createValidator } from '../../create-validator';
import { GreaterThanOrEqualRule } from './greater-than-or-equal.rule';
import { testValidate } from '../../../testing';

describe(GreaterThanOrEqualRule.name, () => {
  const referenceValue = 10;
  const validator = createValidator<Person>(val => val.ruleFor('age').greaterThanOrEqualTo(referenceValue));

  it('should not return an error if the value is greater than the reference value', () => {
    const result = testValidate(validator, createPersonWith({ age: referenceValue + 1 }));
    expect(result.isValid).toBeTruthy();
    expect(result.errors).toHaveLength(0);
  });

  it('should not return an error if the value is equal to the reference value', () => {
    const result = testValidate(validator, createPersonWith({ age: referenceValue }));
    expect(result.isValid).toBeTruthy();
    expect(result.errors).toHaveLength(0);
  });

  it('should return an error if the value is less than the reference value', () => {
    const result = testValidate(validator, createPersonWith({ age: referenceValue - 1 }));
    expect(result.isValid).toBeFalsy();
    expect(result.errors).toHaveLength(1);
    result.shouldHaveValidationErrorFor(p => p.age).withMessage('age must be greater than or equal to 10.');
  });

  it('should fall back to `0` if the value is nullish', () => {
    const result = testValidate(validator, createPersonWith({ age: null as unknown as number }));
    expect(result.isValid).toBeFalsy();
    expect(result.errors).toHaveLength(1);
    result.shouldHaveValidationErrorFor(p => p.age).withMessage('age must be greater than or equal to 10.');
  });
});
