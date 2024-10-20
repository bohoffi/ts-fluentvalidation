import { createValidationResult } from '../lib/result/validation-result';
import { expectFailureLength, expectResultInvalid, expectResultValid } from './assertions';

describe('ValidationResult', () => {
  it('should create a valid result', () => {
    const result = createValidationResult();
    expectResultValid(result);
    expectFailureLength(result, 0);
  });

  it('should create an invalid result', () => {
    const result = createValidationResult([
      {
        propertyName: 'lastName',
        message: 'Name is required.',
        severity: 'Error'
      }
    ]);
    expectResultInvalid(result);
    expectFailureLength(result, 1);
  });

  it('should create an invalid result with multiple failures', () => {
    const result = createValidationResult([
      {
        propertyName: 'lastName',
        message: 'Name is required.',
        severity: 'Error'
      },
      {
        propertyName: 'age',
        message: 'Age is required.',
        severity: 'Error'
      }
    ]);
    expectResultInvalid(result);
    expectFailureLength(result, 2);
  });

  it('should join failures with default separator', () => {
    const result = createValidationResult([
      {
        propertyName: 'lastName',
        message: 'Name is required.',
        severity: 'Error'
      },
      {
        propertyName: 'age',
        message: 'Age is required.',
        severity: 'Error'
      }
    ]);
    expect(result.toString()).toBe('Name is required.\nAge is required.');
  });

  it('should join failures with a separator', () => {
    const result = createValidationResult([
      {
        propertyName: 'lastName',
        message: 'Name is required.',
        severity: 'Error'
      },
      {
        propertyName: 'age',
        message: 'Age is required.',
        severity: 'Error'
      }
    ]);
    expect(result.toString('--')).toBe('Name is required.--Age is required.');
  });

  it('should convert failures to dictionary', () => {
    const result = createValidationResult([
      {
        propertyName: 'lastName',
        message: 'Name is required.',
        severity: 'Error'
      },
      {
        propertyName: 'lastName',
        message: 'Name must have a minimum length of 20.',
        severity: 'Error'
      },
      {
        propertyName: 'age',
        message: 'Age is required.',
        severity: 'Error'
      }
    ]);
    expect(result.toDictionary()).toEqual({
      lastName: ['Name is required.', 'Name must have a minimum length of 20.'],
      age: ['Age is required.']
    });
  });
});
