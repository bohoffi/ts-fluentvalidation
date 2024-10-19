import { createValidator } from '../lib/create-validator';
import { createAsyncValidation, createValidation } from '../lib/validations';
import { testValidate, testValidateAsync } from '../testing/src/test-validate';
import {
  expectFailureLength,
  expectResultInvalid,
  expectValidationErrorCodeToBe,
  expectValidationErrorCodeToBeUndefined,
  expectValidationMessageToBe,
  expectValidationMessageToBeUndefined,
  expectValidationMetadataToBeDefined,
  expectValidationPropertyNameOverrideToBe,
  expectValidationPropertyNameToBe,
  expectValidationPropertyNameToBeUndefined,
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

    it('should create validation with default metadata', () => {
      const validation = createValidation<string>(value => value.length > 0);
      expectValidationMessageToBeUndefined(validation);
      expectValidationErrorCodeToBeUndefined(validation);
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

  describe('withErrorCode', () => {
    it('should create a validation function with an errorCode', () => {
      const isNonEmptyString = createValidation<string>(value => value.length > 0);
      const validationWithMessage = isNonEmptyString.withErrorCode('ERR123');

      expectValidationErrorCodeToBeUndefined(isNonEmptyString);
      expectValidationErrorCodeToBe(validationWithMessage, 'ERR123');
    });
  });

  describe('withName', () => {
    it('should create a validation function with a property name', () => {
      const isNonEmptyString = createValidation<string>(value => value.length > 0);
      const validationWithMessage = isNonEmptyString.withName('FOO');

      expectValidationPropertyNameToBeUndefined(isNonEmptyString);
      expectValidationPropertyNameToBe(validationWithMessage, 'FOO');
    });
  });

  describe('overridePropertyName', () => {
    it('should create a validation function with an overriden property name', () => {
      const isNonEmptyString = createValidation<string>(value => value.length > 0);
      const validationWithMessage = isNonEmptyString.overridePropertyName('FOO');

      expectValidationPropertyNameToBeUndefined(isNonEmptyString);
      expectValidationPropertyNameOverrideToBe(validationWithMessage, 'FOO');
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

  describe('withState', () => {
    const testPerson = createPersonWith({ lastName: '' });
    const customState = { foo: 'bar' };
    it('should create a validation function with custom state', () => {
      const isNonEmptyString = createValidation<string, Person>(value => value.length > 0).withState(customState);
      const validator = createValidator<Person>().ruleFor('lastName', isNonEmptyString);
      const result = testValidate(validator, testPerson);

      expectValidationMetadataToBeDefined(isNonEmptyString, 'customStateProvider');
      expectResultInvalid(result);
      expectFailureLength(result, 1);
      result.shouldHaveValidationErrorFor('lastName').withCustomState(customState);
    });

    it('should create a validation function with custom state provider using model', () => {
      const isNonEmptyString = createValidation<string, Person>(value => value.length > 0).withState<Person>(model => customState);
      const validator = createValidator<Person>().ruleFor('lastName', isNonEmptyString);
      const result = testValidate(validator, testPerson);

      expectValidationMetadataToBeDefined(isNonEmptyString, 'customStateProvider');
      expectResultInvalid(result);
      expectFailureLength(result, 1);
      result.shouldHaveValidationErrorFor('lastName').withCustomState(customState);
    });

    it('should create a validation function with custom state provider using model and value', () => {
      const isNonEmptyString = createValidation<string, Person>(value => value.length > 0).withState<Person, string>(
        (model, value) => customState
      );
      const validator = createValidator<Person>().ruleFor('lastName', isNonEmptyString);
      const result = testValidate(validator, testPerson);

      expectValidationMetadataToBeDefined(isNonEmptyString, 'customStateProvider');
      expectResultInvalid(result);
      expectFailureLength(result, 1);
      result.shouldHaveValidationErrorFor('lastName').withCustomState(customState);
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

    it('should create validation with default metadata', () => {
      const validation = createAsyncValidation<string>(value => Promise.resolve(value.length > 0));
      expectValidationMessageToBeUndefined(validation);
      expectValidationErrorCodeToBeUndefined(validation);
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

  describe('withErrorCode', () => {
    it('should create a validation function with an errorCode', () => {
      const isNonEmptyString = createAsyncValidation<string>(value => Promise.resolve(value.length > 0));
      const validationWithMessage = isNonEmptyString.withErrorCode('ERR123');

      expectValidationErrorCodeToBeUndefined(isNonEmptyString);
      expectValidationErrorCodeToBe(validationWithMessage, 'ERR123');
    });
  });

  describe('withName', () => {
    it('should create a validation function with a property name', () => {
      const isNonEmptyString = createAsyncValidation<string>(value => Promise.resolve(value.length > 0));
      const validationWithMessage = isNonEmptyString.withName('FOO');

      expectValidationPropertyNameToBeUndefined(isNonEmptyString);
      expectValidationPropertyNameToBe(validationWithMessage, 'FOO');
    });
  });

  describe('overridePropertyName', () => {
    it('should create a validation function with an overriden property name', () => {
      const isNonEmptyString = createValidation<string>(value => value.length > 0);
      const validationWithMessage = isNonEmptyString.overridePropertyName('FOO');

      expectValidationPropertyNameToBeUndefined(isNonEmptyString);
      expectValidationPropertyNameOverrideToBe(validationWithMessage, 'FOO');
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

  describe('withState', () => {
    const testPerson = createPersonWith({ lastName: '' });
    const customState = { foo: 'bar' };
    it('should create a validation function with custom state', async () => {
      const isNonEmptyString = createAsyncValidation<string>(value => Promise.resolve(value.length > 0)).withState(customState);
      const validator = createValidator<Person>().ruleFor('lastName', isNonEmptyString);
      const result = await testValidateAsync(validator, testPerson);

      expectValidationMetadataToBeDefined(isNonEmptyString, 'customStateProvider');
      expectResultInvalid(result);
      expectFailureLength(result, 1);
      result.shouldHaveValidationErrorFor('lastName').withCustomState(customState);
    });

    it('should create a validation function with custom state provider using model', async () => {
      const isNonEmptyString = createAsyncValidation<string>(value => Promise.resolve(value.length > 0)).withState<Person>(
        model => customState
      );
      const validator = createValidator<Person>().ruleFor('lastName', isNonEmptyString);
      const result = await testValidateAsync(validator, testPerson);

      expectValidationMetadataToBeDefined(isNonEmptyString, 'customStateProvider');
      expectResultInvalid(result);
      expectFailureLength(result, 1);
      result.shouldHaveValidationErrorFor('lastName').withCustomState(customState);
    });

    it('should create a validation function with custom state provider using model and value', async () => {
      const isNonEmptyString = createAsyncValidation<string>(value => Promise.resolve(value.length > 0)).withState<Person, string>(
        (model, value) => customState
      );
      const validator = createValidator<Person>().ruleFor('lastName', isNonEmptyString);
      const result = await testValidateAsync(validator, testPerson);

      expectValidationMetadataToBeDefined(isNonEmptyString, 'customStateProvider');
      expectResultInvalid(result);
      expectFailureLength(result, 1);
      result.shouldHaveValidationErrorFor('lastName').withCustomState(customState);
    });
  });
});
