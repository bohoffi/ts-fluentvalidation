import { ValidationFailure } from './validation-failure';
import { ValidationResult } from './validation-result';

function createFailureForTest(propertyName: string, message: string): ValidationFailure {
  return new ValidationFailure(propertyName, message, propertyName);
}

describe(ValidationResult.name, () => {
  it('should return `isValid === true` if the value is valid', () => {
    const result = new ValidationResult();
    expect(result.isValid).toBeTruthy();
  });

  it('should return `isValid === false` if the value is invalid', () => {
    const result = new ValidationResult([createFailureForTest('name', 'Name is required')]);
    expect(result.isValid).toBeFalsy();
  });

  it('should expose the failures via the `errors` property', () => {
    const failure = createFailureForTest('name', 'Name is required');
    const result = new ValidationResult([failure]);
    expect(result.errors).toEqual([failure]);
  });

  it('should override the default error message using `withMessage`', () => {
    const failure = createFailureForTest('name', 'Name is required');
    const result = new ValidationResult([failure]);
    expect(result.errors[0].message).toBe('Name is required');
  });

  it('should override the property name using `withName`', () => {
    const failure = createFailureForTest('name', 'Name is required');
    const result = new ValidationResult([failure]);
    expect(result.errors[0].propertyName).toBe('name');
  });

  it('should return a string representation of the error messages', () => {
    const failure = createFailureForTest('name', 'Name is required');
    const result = new ValidationResult([failure]);
    expect(result.toString()).toBe('Name is required');
  });

  it('should convert the validation errors into a dictionary', () => {
    const failure = createFailureForTest('name', 'Name is required');
    const result = new ValidationResult([failure]);
    expect(result.toDictionary()).toEqual({ name: ['Name is required'] });
  });
});
