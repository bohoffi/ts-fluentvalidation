import { createPersonWith } from '../../testing/test-data';
import { Person } from '../../testing/test-models';
import { createValidator } from '../../create-validator';
import { NotEqualRule } from './not-equal.rule';

describe(NotEqualRule.name, () => {
  const referenceValue = 'abc';
  const validator = createValidator<Person>(val => val.ruleFor('name').notEqual(referenceValue));

  it('should not return an error if the value is not equal to the reference value', () => {
    const result = validator.validate(createPersonWith({ name: 'def' }));
    expect(result.isValid).toBeTruthy();
    expect(result.errors).toHaveLength(0);
  });

  it('should return an error if the value is equal to the reference value', () => {
    const result = validator.validate(createPersonWith({ name: referenceValue }));
    expect(result.isValid).toBeFalsy();
    expect(result.errors).toHaveLength(1);
    expect(result.errors[0].message).toBe('name must not be equal to abc.');
  });
});
