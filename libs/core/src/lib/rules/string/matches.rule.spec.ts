import { createPersonWith } from '../../testing/test-data';
import { Person } from '../../testing/test-models';
import { createValidator } from '../../validator';
import { MatchesRule } from './matches.rule';

describe(MatchesRule.name, () => {
  const validator = createValidator<Person>(val => val.ruleFor('name').matches(/^[A-Z]+$/));

  it('should not return an error if the value is a string that matches the pattern', () => {
    const result = validator.validate(createPersonWith({ name: 'ABC' }));
    expect(result.isValid).toBeTruthy();
    expect(result.failures).toHaveLength(0);
  });

  it('should return an error if the value is a string that does not match the pattern', () => {
    const result = validator.validate(createPersonWith({ name: '123' }));
    expect(result.isValid).toBeFalsy();
    expect(result.failures).toHaveLength(1);
    expect(result.failures[0].message).toBe('name must match the pattern /^[A-Z]+$/');
  });
});
