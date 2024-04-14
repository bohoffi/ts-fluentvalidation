import { createPersonWith } from '../../testing/test-data';
import { Person } from '../../testing/test-models';
import { createValidator } from '../../create-validator';
import { ExclusiveBetweenRule } from './exclusive-between.rule';

describe(ExclusiveBetweenRule.name, () => {
  const lowerBound = 18;
  const upperBound = 65;
  const validator = createValidator<Person>(val => val.ruleFor('age').exclusiveBetween(lowerBound, upperBound));

  it('should not return an error if the value is within the bounds', () => {
    // calc average between lower and upper bounds
    const average = (lowerBound + upperBound) / 2;
    const result = validator.validate(createPersonWith({ age: average }));
    expect(result.isValid).toBeTruthy();
    expect(result.errors).toHaveLength(0);
  });

  it('should return an error if the value is equal to the lower bound', () => {
    const result = validator.validate(createPersonWith({ age: lowerBound }));
    expect(result.isValid).toBeFalsy();
    expect(result.errors).toHaveLength(1);
    expect(result.errors[0].message).toBe('age must be between 18 and 65 (exclusive).');
  });

  it('should return an error if the value is equal to the upper bound', () => {
    const result = validator.validate(createPersonWith({ age: upperBound }));
    expect(result.isValid).toBeFalsy();
    expect(result.errors).toHaveLength(1);
    expect(result.errors[0].message).toBe('age must be between 18 and 65 (exclusive).');
  });

  it('should return an error if the value is outside the bounds', () => {
    const result = validator.validate(createPersonWith({ age: upperBound + 1 }));
    expect(result.isValid).toBeFalsy();
    expect(result.errors).toHaveLength(1);
    expect(result.errors[0].message).toBe('age must be between 18 and 65 (exclusive).');
  });

  it('should fall back to `0` if the value is nullish', () => {
    const fallbackValidator = createValidator<Person>(val => val.ruleFor('age').exclusiveBetween(-10, -5));
    const result = fallbackValidator.validate(createPersonWith({ age: null as unknown as number }));
    expect(result.isValid).toBeFalsy();
    expect(result.errors).toHaveLength(1);
    expect(result.errors[0].message).toBe('age must be between -10 and -5 (exclusive).');
  });
});
