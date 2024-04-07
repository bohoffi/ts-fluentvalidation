import { createPersonWith } from '../../testing/test-data';
import { Person } from '../../testing/test-models';
import { createValidator } from '../../validator';
import { NotEqualsRule } from './not-equals.rule';

describe(NotEqualsRule.name, () => {
  const referenceValue = 'abc';
  const validator = createValidator<Person>(val => val.ruleFor('name').notEquals(referenceValue));

  it('should not return an error if the value is not equal to the reference value', () => {
    const result = validator.validate(createPersonWith({ name: 'def' }));
    expect(result.isValid).toBeTruthy();
    expect(result.failures).toHaveLength(0);
  });

  it('should return an error if the value is equal to the reference value', () => {
    const result = validator.validate(createPersonWith({ name: referenceValue }));
    expect(result.isValid).toBeFalsy();
    expect(result.failures).toHaveLength(1);
    expect(result.failures[0].message).toBe('name must not be equal to abc');
  });
});