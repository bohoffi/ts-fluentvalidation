import { createValidator } from '../lib/functional/create-validator';
import { testValidate, testValidateAsync } from '../lib/functional/testing/src/test-validate';
import { createAsyncValidation, createValidation } from '../lib/functional/validations';
import {
  expectFailureLength,
  expectResultInvalid,
  expectValidationMessageToBe,
  expectValidationMetadataToBeDefined,
  expectValidationToFail,
  expectValidationToFailAsync,
  expectValidationToPass,
  expectValidationToPassAsync
} from './assertions';
import { createPersonWith, Person } from './fixtures';

describe(createValidation.name, () => {
  describe('validation creation', () => {
    it('should create a validation function that returns true for valid values', () => {
      const isNonEmptyString = createValidation<string>(value => value.length > 0);

      expectValidationToPass(isNonEmptyString, 'valid');
    });

    it('should create a validation function that returns false for invalid values', () => {
      const isNonEmptyString = createValidation<string>(value => value.length > 0);

      expectValidationToFail(isNonEmptyString, '');
    });

    it('should create a validation function with a message', () => {
      const isNonEmptyString = createValidation<string>(value => value.length > 0, 'Value must not be empty');

      expectValidationMessageToBe(isNonEmptyString, 'Value must not be empty');
    });
  });

  describe('withMessage', () => {
    it('should create a validation function with a message', () => {
      const isNonEmptyString = createValidation<string>(value => value.length > 0, 'FOO BAR');
      const validationWithMessage = isNonEmptyString.withMessage('Value must not be empty');

      expectValidationMessageToBe(isNonEmptyString, 'FOO BAR');
      expectValidationMessageToBe(validationWithMessage, 'Value must not be empty');
    });
  });

  describe('withSeverity', () => {
    const testPerson = createPersonWith({ lastName: '' });
    it('should create a validation function with a severity', () => {
      const isNonEmptyString = createValidation<string, Person>(value => value.length > 0).withSeverity('Warning');
      const validator = createValidator<Person>().ruleFor('lastName', isNonEmptyString);
      const result = testValidate(validator, testPerson);

      expectValidationMetadataToBeDefined(isNonEmptyString, 'severityProvider');
      expectResultInvalid(result);
      expectFailureLength(result, 1);
      result.shouldHaveValidationErrorFor('lastName').withSeverity('Warning');
    });

    it('should create a validation function with a severity provider using model', () => {
      const isNonEmptyString = createValidation<string, Person>(value => value.length > 0).withSeverity<Person>(model => 'Warning');
      const validator = createValidator<Person>().ruleFor('lastName', isNonEmptyString);
      const result = testValidate(validator, testPerson);

      expectValidationMetadataToBeDefined(isNonEmptyString, 'severityProvider');
      expectResultInvalid(result);
      expectFailureLength(result, 1);
      result.shouldHaveValidationErrorFor('lastName').withSeverity('Warning');
    });

    it('should create a validation function with a severity provider using model and value', () => {
      const isNonEmptyString = createValidation<string, Person>(value => value.length > 0).withSeverity<Person, string>(
        (model, value) => 'Warning'
      );
      const validator = createValidator<Person>().ruleFor('lastName', isNonEmptyString);
      const result = testValidate(validator, testPerson);

      expectValidationMetadataToBeDefined(isNonEmptyString, 'severityProvider');
      expectResultInvalid(result);
      expectFailureLength(result, 1);
      result.shouldHaveValidationErrorFor('lastName').withSeverity('Warning');
    });
  });
});

describe(createAsyncValidation.name, () => {
  describe('validation creation', () => {
    it('should create a validation function that returns true for valid values', () => {
      const isNonEmptyString = createAsyncValidation<string>(value => Promise.resolve(value.length > 0));

      expectValidationToPassAsync(isNonEmptyString, 'valid');
    });

    it('should create a validation function that returns false for invalid values', () => {
      const isNonEmptyString = createAsyncValidation<string>(value => Promise.resolve(value.length > 0));

      expectValidationToFailAsync(isNonEmptyString, '');
    });

    it('should create a validation function with a message', () => {
      const isNonEmptyString = createAsyncValidation<string>(value => Promise.resolve(value.length > 0), 'Value must not be empty');

      expectValidationMessageToBe(isNonEmptyString, 'Value must not be empty');
    });
  });

  describe('withMessage', () => {
    it('should create a validation function with a message', () => {
      const isNonEmptyString = createAsyncValidation<string>(value => Promise.resolve(value.length > 0), 'FOO BAR');
      const validationWithMessage = isNonEmptyString.withMessage('Value must not be empty');

      expectValidationMessageToBe(isNonEmptyString, 'FOO BAR');
      expectValidationMessageToBe(validationWithMessage, 'Value must not be empty');
    });
  });

  describe('withSeverity', () => {
    const testPerson = createPersonWith({ lastName: '' });
    it('should create a validation function with a severity', async () => {
      const isNonEmptyString = createAsyncValidation<string>(value => Promise.resolve(value.length > 0)).withSeverity('Warning');
      const validator = createValidator<Person>().ruleFor('lastName', isNonEmptyString);
      const result = await testValidateAsync(validator, testPerson);

      expectValidationMetadataToBeDefined(isNonEmptyString, 'severityProvider');
      expectResultInvalid(result);
      expectFailureLength(result, 1);
      result.shouldHaveValidationErrorFor('lastName').withSeverity('Warning');
    });

    it('should create a validation function with a severity provider using model', async () => {
      const isNonEmptyString = createAsyncValidation<string>(value => Promise.resolve(value.length > 0)).withSeverity<Person>(
        model => 'Warning'
      );
      const validator = createValidator<Person>().ruleFor('lastName', isNonEmptyString);
      const result = await testValidateAsync(validator, testPerson);

      expectValidationMetadataToBeDefined(isNonEmptyString, 'severityProvider');
      expectResultInvalid(result);
      expectFailureLength(result, 1);
      result.shouldHaveValidationErrorFor('lastName').withSeverity('Warning');
    });

    it('should create a validation function with a severity provider using model and value', async () => {
      const isNonEmptyString = createAsyncValidation<string>(value => Promise.resolve(value.length > 0)).withSeverity<Person, string>(
        (model, value) => 'Warning'
      );
      const validator = createValidator<Person>().ruleFor('lastName', isNonEmptyString);
      const result = await testValidateAsync(validator, testPerson);

      expectValidationMetadataToBeDefined(isNonEmptyString, 'severityProvider');
      expectResultInvalid(result);
      expectFailureLength(result, 1);
      result.shouldHaveValidationErrorFor('lastName').withSeverity('Warning');
    });
  });
});
