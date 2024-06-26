import { createPersonWith } from '../../testing/test-data';
import { Person } from '../../testing/test-models';
import { createValidator } from '../../create-validator';
import { MatchesRule } from './matches.rule';
import { testValidate } from '../../../testing';

describe(MatchesRule.name, () => {
  const validator = createValidator<Person>(val => val.ruleFor('name').matches(/^[A-Z]+$/));

  it('should not return an error if the value is a string that matches the pattern', () => {
    const result = testValidate(validator, createPersonWith({ name: 'ABC' }));
    expect(result.isValid).toBeTruthy();
    expect(result.errors).toHaveLength(0);
  });

  it('should return an error if the value is a string that does not match the pattern', () => {
    const result = testValidate(validator, createPersonWith({ name: '123' }));
    expect(result.isValid).toBeFalsy();
    expect(result.errors).toHaveLength(1);
    result.shouldHaveValidationErrorFor(p => p.name).withMessage('name is not in the correct format.');
  });

  it('should fall back to an empty string if the value is nullish', () => {
    const result = testValidate(validator, createPersonWith({ name: null as unknown as string }));
    expect(result.isValid).toBeFalsy();
    expect(result.errors).toHaveLength(1);
    result.shouldHaveValidationErrorFor(p => p.name).withMessage('name is not in the correct format.');
  });
});
