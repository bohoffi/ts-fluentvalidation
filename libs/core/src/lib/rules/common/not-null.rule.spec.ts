import { createPersonWith } from '../../testing/test-data';
import { Person } from '../../testing/test-models';
import { createValidator } from '../../create-validator';
import { NotNullRule } from './not-null.rule';

describe(NotNullRule.name, () => {
  const validator = createValidator<Person>(val => val.ruleFor('name').notNull());

  it('should not return an error if the value is not null', () => {
    const result = validator.validate(createPersonWith({ name: 'abc' }));
    expect(result.isValid).toBeTruthy();
    expect(result.errors).toHaveLength(0);
  });

  it('should return an error if the value is null', () => {
    const result = validator.validate(createPersonWith({ name: null } as unknown as Partial<Person>));
    expect(result.isValid).toBeFalsy();
    expect(result.errors).toHaveLength(1);
    expect(result.errors[0].message).toBe('name must not be null.');
  });
});
