import { ValidationError } from '../result/validation-error';
import { createValidationFn, minLength, notEmpty } from '../validations';
import { validateKeySync } from './validate-key-sync';

describe('validateKeySync', () => {
  interface TestModel {
    name: string;
    age: number;
  }

  const model: TestModel = {
    name: 'John Doe',
    age: 30
  };

  it('should return no failures when all validations pass', () => {
    const validationFn = notEmpty('Name cannot be empty');

    const result = validateKeySync(model, 'name', [validationFn], 'Continue');
    expect(result).toEqual([]);
  });

  it('should return a failure when a validation fails', () => {
    const failingValidationFn = minLength(11, 'Name must be longer than 10 characters');

    const result = validateKeySync(model, 'name', [failingValidationFn], 'Continue');
    expect(result).toEqual([
      {
        propertyName: 'name',
        message: 'Name must be longer than 10 characters',
        attemptedValue: 'John Doe'
      }
    ]);
  });

  it('should throw a ValidationError when throwOnFailures is true', () => {
    const failingValidationFn = minLength(11, 'Name must be longer than 10 characters');

    expect(() => validateKeySync(model, 'name', [failingValidationFn], 'Continue', true)).toThrow(ValidationError);
  });

  it('should stop validation on first failure when cascade mode is Stop', () => {
    const failingValidationFn1 = minLength(11, 'Name must be longer than 10 characters');

    const failingValidationFn2 = createValidationFn<string>(value => value?.includes('Doe') === true, 'Name must include Doe');

    const result = validateKeySync(model, 'name', [failingValidationFn1, failingValidationFn2], 'Stop');
    expect(result).toEqual([
      {
        propertyName: 'name',
        message: 'Name must be longer than 10 characters',
        attemptedValue: 'John Doe'
      }
    ]);
  });

  it('should continue validation on failure when cascade mode is Continue', () => {
    const failingValidationFn1 = minLength(11, 'Name must be longer than 10 characters');

    const failingValidationFn2 = createValidationFn<string>(value => value?.includes('Jane') === true, 'Name must include Jane');

    const result = validateKeySync(model, 'name', [failingValidationFn1, failingValidationFn2], 'Continue');
    expect(result).toEqual([
      {
        propertyName: 'name',
        message: 'Name must be longer than 10 characters',
        attemptedValue: 'John Doe'
      },
      {
        propertyName: 'name',
        message: 'Name must include Jane',
        attemptedValue: 'John Doe'
      }
    ]);
  });
});
