import { createPersonWith } from '../../testing/test-data';
import { Person } from '../../testing/test-models';
import { createValidator } from '../../create-validator';
import { EmptyRule } from './empty.rule';
import { testValidate } from '../../../testing';

describe(EmptyRule.name, () => {
  const validator = createValidator<Person>(val => val.ruleFor('name').empty());

  it('should not return an error if the value is an empty string', () => {
    const result = testValidate(validator, createPersonWith({ name: '' }));
    expect(result.isValid).toBeTruthy();
    expect(result.errors).toHaveLength(0);
  });

  it('should return an error if the value is a non-empty string', () => {
    const result = testValidate(validator, createPersonWith({ name: 'abc' }));
    expect(result.isValid).toBeFalsy();
    expect(result.errors).toHaveLength(1);
    result.shouldHaveValidationErrorFor(p => p.name).withMessage('name must be empty.');
  });
});
