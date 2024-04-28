import { createPersonWith } from '../../testing/test-data';
import { Person } from '../../testing/test-models';
import { createValidator } from '../../create-validator';
import { LessThanRule } from './less-than.rule';
import { testValidate } from '../../../testing';

describe(LessThanRule.name, () => {
  const referenceValue = 10;
  const validator = createValidator<Person>(val => val.ruleFor('age').lessThan(referenceValue));

  it('should not return an error if the value is less than the reference value', () => {
    const result = testValidate(validator, createPersonWith({ age: referenceValue - 1 }));
    expect(result.isValid).toBeTruthy();
    expect(result.errors).toHaveLength(0);
  });

  it('should return an error if the value is equal to the reference value', () => {
    const result = testValidate(validator, createPersonWith({ age: referenceValue }));
    expect(result.isValid).toBeFalsy();
    expect(result.errors).toHaveLength(1);
    result.shouldHaveValidationErrorFor(p => p.age).withMessage('age must be less than 10.');
  });

  it('should return an error if the value is greater than the reference value', () => {
    const result = testValidate(validator, createPersonWith({ age: referenceValue + 1 }));
    expect(result.isValid).toBeFalsy();
    expect(result.errors).toHaveLength(1);
    result.shouldHaveValidationErrorFor(p => p.age).withMessage('age must be less than 10.');
  });

  it('should fall back to `0` if the value is nullish', () => {
    const fallbackValidator = createValidator<Person>(val => val.ruleFor('age').lessThan(-1));
    const result = testValidate(fallbackValidator, createPersonWith({ age: null as unknown as number }));
    expect(result.isValid).toBeFalsy();
    expect(result.errors).toHaveLength(1);
    result.shouldHaveValidationErrorFor(p => p.age).withMessage('age must be less than -1.');
  });
});
