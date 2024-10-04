import { createValidator } from '../lib/functional/create-validator';
import { testValidate, testValidateAsync } from '../lib/functional/testing/src/test-validate';
import { AsyncValidation, SyncValidation } from '../lib/functional/types/types';
import { minLength, must, mustAsync, notEmpty } from '../lib/functional/validations';
import { expectFailureLength, expectResultInvalid, expectValidationsFor, expectValidationsForWithLength } from './assertions';
import { createPersonWith, Person } from './fixtures';

describe('ruleFor', () => {
  describe('add rules', () => {
    it('should add rule for key', () => {
      const validator = createValidator<Person>().ruleFor('firstName', notEmpty());
      expectValidationsFor(validator, 'firstName');
      expectValidationsForWithLength(validator, 'firstName', 1);
    });

    it('should add multiple rules for the same key', () => {
      const validator = createValidator<Person>().ruleFor('firstName', notEmpty(), minLength(1));
      expectValidationsFor(validator, 'firstName');
      expectValidationsForWithLength(validator, 'firstName', 2);
    });

    it('should add multiple rules for the same key on subsequent calls', () => {
      const validator = createValidator<Person>().ruleFor('firstName', notEmpty()).ruleFor('firstName', minLength(1));
      expectValidationsFor(validator, 'firstName');
      expectValidationsForWithLength(validator, 'firstName', 2);
    });

    it('should add multiple rules for different keys', () => {
      const validator = createValidator<Person>().ruleFor('firstName', notEmpty()).ruleFor('lastName', notEmpty());
      expectValidationsFor(validator, 'firstName');
      expectValidationsForWithLength(validator, 'firstName', 1);
      expectValidationsFor(validator, 'lastName');
      expectValidationsForWithLength(validator, 'lastName', 1);
    });

    it('should add custom synchronous rule for key', () => {
      function shouldNotStartWith<TModel>(referenceValue: string): SyncValidation<string, TModel> {
        return must((value: string) => !value.startsWith(referenceValue), `The value shall not start with ${referenceValue}.`);
      }

      const validator = createValidator<Person>().ruleFor('firstName', shouldNotStartWith('J'));
      const result = testValidate(validator, createPersonWith({ firstName: 'John' }));
      expectResultInvalid(result);
      expectFailureLength(result, 1);
      result.shouldHaveValidationErrorFor('firstName').withMessage('The value shall not start with J.');
    });

    it('should add custom asynchronous rule for key', async () => {
      function shouldNotStartWithAsync<TModel>(referenceValue: string): AsyncValidation<string, TModel> {
        return mustAsync(
          (value: string) => Promise.resolve(!value.startsWith(referenceValue)),
          `The value shall not start with ${referenceValue}.`
        );
      }

      const validator = createValidator<Person>().ruleFor('firstName', shouldNotStartWithAsync('J'));
      const result = await testValidateAsync(validator, createPersonWith({ firstName: 'John' }));
      expectResultInvalid(result);
      expectFailureLength(result, 1);
      result.shouldHaveValidationErrorFor('firstName').withMessage('The value shall not start with J.');
    });
  });

  describe('cascadeMode', () => {
    const testPerson = createPersonWith({ firstName: '', lastName: '', age: 17 });

    it('should stop synchronous validation on first failure with propertyCascadeMode set to Stop', () => {
      const validator = createValidator<Person>().ruleFor('firstName', 'Stop', notEmpty(), minLength(1));

      const result = testValidate(validator, testPerson);
      expectResultInvalid(result);
      expectFailureLength(result, 1);
      result.shouldHaveValidationErrorFor('firstName').withMessage(`'firstName' must not be empty.`);
    });

    it('should continue synchronous validation on failure with propertyCascadeMode set to Continue or undefined', () => {
      const validator = createValidator<Person>().ruleFor('firstName', 'Continue', notEmpty(), minLength(1));

      const result = testValidate(validator, testPerson);
      expectResultInvalid(result);
      expectFailureLength(result, 2);
      result.shouldHaveValidationErrorFor('firstName').withMessage(`'firstName' must not be empty.`);
      result.shouldHaveValidationErrorFor('firstName').withMessage(`'firstName' must have a minimum length of 1.`);
    });

    it('should stop asynchronous validation on first failure with propertyCascadeMode set to Stop', async () => {
      const validator = createValidator<Person>().ruleFor('firstName', 'Stop', notEmpty(), minLength(1));

      const result = await testValidateAsync(validator, testPerson);
      expectResultInvalid(result);
      expectFailureLength(result, 1);
      result.shouldHaveValidationErrorFor('firstName').withMessage(`'firstName' must not be empty.`);
    });

    it('should continue asynchronous validation on failure with propertyCascadeMode set to Continue or undefined', async () => {
      const validator = createValidator<Person>().ruleFor('firstName', 'Continue', notEmpty(), minLength(1));

      const result = await testValidateAsync(validator, testPerson);
      expectResultInvalid(result);
      expectFailureLength(result, 2);
      result.shouldHaveValidationErrorFor('firstName').withMessage(`'firstName' must not be empty.`);
      result.shouldHaveValidationErrorFor('firstName').withMessage(`'firstName' must have a minimum length of 1.`);
    });

    it('should use propertyCascadeMode from last ruleFor call for the same key', () => {
      const validator = createValidator<Person>().ruleFor('firstName', 'Stop', notEmpty()).ruleFor('firstName', 'Continue', minLength(1));

      const result = testValidate(validator, testPerson);
      expectResultInvalid(result);
      expectFailureLength(result, 2);
      result.shouldHaveValidationErrorFor('firstName').withMessage(`'firstName' must not be empty.`);
      result.shouldHaveValidationErrorFor('firstName').withMessage(`'firstName' must have a minimum length of 1.`);
    });
  });
});
