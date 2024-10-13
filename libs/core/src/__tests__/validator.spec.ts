import { createValidator } from '../lib/functional/create-validator';
import { testValidate, testValidateAsync } from '../lib/functional/testing/src/test-validate';
import {
  greaterThanOrEquals,
  lessThanOrEquals,
  matches,
  mustAsync,
  notEmpty,
  setValidator,
  setValidatorAsync
} from '../lib/functional/validations';
import {
  expectFailureLength,
  expectResultInvalid,
  expectResultValid,
  expectValidationsFor,
  expectValidationsForWithLength
} from './assertions';
import { Address, createAddressWith, createOrderWith, createPersonWith, Order, Person } from './fixtures';

describe('Validator', () => {
  describe('include', () => {
    it('should include validator', () => {
      const personAgeValidator = createValidator<Person>().ruleFor('age', greaterThanOrEquals(18));
      const personNameValidator = createValidator<Person>().ruleFor('lastName', notEmpty());
      const personValidator = createValidator<Person>().include(personAgeValidator).include(personNameValidator);

      expectValidationsFor(personValidator, 'age');
      expectValidationsForWithLength(personValidator, 'age', 1);
      expectValidationsFor(personValidator, 'lastName');
      expectValidationsForWithLength(personValidator, 'lastName', 1);
    });

    it('should add included rules to existing keys', () => {
      const personAgeValidator = createValidator<Person>().ruleFor('age', greaterThanOrEquals(18));
      const personValidator = createValidator<Person>().ruleFor('age', lessThanOrEquals(65)).include(personAgeValidator);

      expectValidationsFor(personValidator, 'age');
      expectValidationsForWithLength(personValidator, 'age', 2);
    });
  });

  describe('validate', () => {
    it('should pass validation for valid object with single validation for single key', () => {
      const validator = createValidator<Person>().ruleFor('lastName', notEmpty());
      const result = validator.validate(createPersonWith());

      expectResultValid(result);
    });

    it('should fail validation for invalid object with single validation for single key', () => {
      const validator = createValidator<Person>().ruleFor('lastName', notEmpty());
      const result = testValidate(validator, createPersonWith({ lastName: '' }));

      expectResultInvalid(result);
      expectFailureLength(result, 1);
      result.shouldHaveValidationErrorFor('lastName');
    });

    it('should pass validation for valid object with multiple validations for single key', () => {
      const validator = createValidator<Person>().ruleFor('lastName', notEmpty(), matches(/^[A-Z]/));
      const result = validator.validate(createPersonWith({ lastName: 'Doe' }));

      expectResultValid(result);
    });

    it('should fail validation for invalid object with multiple validations for single key', () => {
      const validator = createValidator<Person>().ruleFor('lastName', notEmpty(), matches(/^[A-Z]/));
      const result = testValidate(validator, createPersonWith({ lastName: 'doe' }));

      expectResultInvalid(result);
      expectFailureLength(result, 1);
      result.shouldHaveValidationErrorFor('lastName');
    });

    it('should pass validation for valid object with single validation for multiple keys', () => {
      const validator = createValidator<Person>().ruleFor('lastName', notEmpty()).ruleFor('age', greaterThanOrEquals(18));
      const result = validator.validate(createPersonWith({ age: 18 }));

      expectResultValid(result);
    });

    it('should fail validation for invalid object with single validation for multiple keys', () => {
      const validator = createValidator<Person>().ruleFor('lastName', notEmpty()).ruleFor('age', greaterThanOrEquals(18));
      const result = testValidate(validator, createPersonWith({ lastName: '', age: 17 }));

      expectResultInvalid(result);
      expectFailureLength(result, 2);
      result.shouldHaveValidationErrorFor('lastName');
      result.shouldHaveValidationErrorFor('age');
    });

    it('should pass validation for valid object with multiple validations for multiple keys', () => {
      const validator = createValidator<Person>()
        .ruleFor('lastName', notEmpty(), matches(/^[A-Z]/))
        .ruleFor('age', greaterThanOrEquals(18), lessThanOrEquals(65));
      const result = validator.validate(createPersonWith({ lastName: 'Doe', age: 18 }));

      expectResultValid(result);
    });

    it('should fail validation for invalid object with multiple validations for multiple keys', () => {
      const validator = createValidator<Person>()
        .ruleFor('lastName', notEmpty(), matches(/^[A-Z]/))
        .ruleFor('age', greaterThanOrEquals(18), lessThanOrEquals(65));
      const result = testValidate(validator, createPersonWith({ lastName: 'doe', age: 17 }));

      expectResultInvalid(result);
      expectFailureLength(result, 2);
      result.shouldHaveValidationErrorFor('lastName');
      result.shouldHaveValidationErrorFor('age');
    });

    it('should pass validation for valid nested object with child validator', () => {
      const addressValidator = createValidator<Address>().ruleFor('city', notEmpty());
      const validator = createValidator<Person>().ruleFor('address', setValidator(addressValidator));
      const result = validator.validate(createPersonWith());

      expectResultValid(result);
    });

    it('should fail validation for invalid nested object with child validator', () => {
      const addressValidator = createValidator<Address>().ruleFor('city', notEmpty());
      const validator = createValidator<Person>().ruleFor('address', setValidator(addressValidator));
      const result = testValidate(validator, createPersonWith({ address: createAddressWith({ city: '' }) }));

      expectResultInvalid(result);
      result.shouldHaveValidationErrorFor('address.city');
    });

    it('should pass validation for valid nested array with child validator', () => {
      const orderValidator = createValidator<Order>().ruleFor('productName', notEmpty());
      const validator = createValidator<Person>().ruleForEach('orders', setValidator(orderValidator));
      const result = validator.validate(createPersonWith());

      expectResultValid(result);
    });

    it('should fail validation for invalid nested array with child validator', () => {
      const orderValidator = createValidator<Order>().ruleFor('productName', notEmpty());
      const validator = createValidator<Person>().ruleForEach('orders', setValidator(orderValidator));
      const result = testValidate(validator, createPersonWith({ orders: [createOrderWith({ productName: '' })] }));

      expectResultInvalid(result);
      result.shouldHaveValidationErrorFor('orders[0].productName');
    });
  });

  describe('validateAsync', () => {
    it('should pass validation for valid object with single validation for single key', async () => {
      const validator = createValidator<Person>().ruleFor('lastName', notEmpty());
      const result = await validator.validateAsync(createPersonWith());

      expectResultValid(result);
    });

    it('should fail validation for invalid object with single validation for single key', async () => {
      const validator = createValidator<Person>().ruleFor('lastName', notEmpty());
      const result = await testValidateAsync(validator, createPersonWith({ lastName: '' }));

      expectResultInvalid(result);
      expectFailureLength(result, 1);
      result.shouldHaveValidationErrorFor('lastName');
    });

    it('should pass validation for valid object with multiple validations for single key', async () => {
      const validator = createValidator<Person>().ruleFor('lastName', notEmpty(), matches(/^[A-Z]/));
      const result = await validator.validateAsync(createPersonWith({ lastName: 'Doe' }));

      expectResultValid(result);
    });

    it('should fail validation for invalid object with multiple validations for single key', async () => {
      const validator = createValidator<Person>().ruleFor('lastName', notEmpty(), matches(/^[A-Z]/));
      const result = await testValidateAsync(validator, createPersonWith({ lastName: 'doe' }));

      expectResultInvalid(result);
      expectFailureLength(result, 1);
      result.shouldHaveValidationErrorFor('lastName');
    });

    it('should pass validation for valid object with single validation for multiple keys', async () => {
      const validator = createValidator<Person>().ruleFor('lastName', notEmpty()).ruleFor('age', greaterThanOrEquals(18));
      const result = await validator.validateAsync(createPersonWith({ age: 18 }));

      expectResultValid(result);
    });

    it('should fail validation for invalid object with single validation for multiple keys', async () => {
      const validator = createValidator<Person>().ruleFor('lastName', notEmpty()).ruleFor('age', greaterThanOrEquals(18));
      const result = await testValidateAsync(validator, createPersonWith({ lastName: '', age: 17 }));

      expectResultInvalid(result);
      expectFailureLength(result, 2);
      result.shouldHaveValidationErrorFor('lastName');
      result.shouldHaveValidationErrorFor('age');
    });

    it('should pass validation for valid object with multiple validations for multiple keys', async () => {
      const validator = createValidator<Person>()
        .ruleFor('lastName', notEmpty(), matches(/^[A-Z]/))
        .ruleFor('age', greaterThanOrEquals(18), lessThanOrEquals(65));
      const result = await validator.validateAsync(createPersonWith({ lastName: 'Doe', age: 18 }));

      expectResultValid(result);
    });

    it('should fail validation for invalid object with multiple validations for multiple keys', async () => {
      const validator = createValidator<Person>()
        .ruleFor('lastName', notEmpty(), matches(/^[A-Z]/))
        .ruleFor('age', greaterThanOrEquals(18), lessThanOrEquals(65));
      const result = await testValidateAsync(validator, createPersonWith({ lastName: 'doe', age: 17 }));

      expectResultInvalid(result);
      expectFailureLength(result, 2);
      result.shouldHaveValidationErrorFor('lastName');
      result.shouldHaveValidationErrorFor('age');
    });

    it('should pass validation for valid nested object with child validator', async () => {
      const addressValidator = createValidator<Address>().ruleFor(
        'city',
        mustAsync(city => Promise.resolve(city !== ''))
      );
      const validator = createValidator<Person>().ruleFor('address', setValidatorAsync(addressValidator));
      const result = await validator.validateAsync(createPersonWith());

      expectResultValid(result);
    });

    it('should fail validation for invalid nested object with child validator', async () => {
      const addressValidator = createValidator<Address>().ruleFor(
        'city',
        mustAsync(city => Promise.resolve(city !== ''))
      );
      const validator = createValidator<Person>().ruleFor('address', setValidatorAsync(addressValidator));
      const result = await testValidateAsync(validator, createPersonWith({ address: createAddressWith({ city: '' }) }));

      expectResultInvalid(result);
      result.shouldHaveValidationErrorFor('address.city');
    });

    it('should pass validation for valid nested array with child validator', async () => {
      const orderValidator = createValidator<Order>().ruleFor(
        'productName',
        mustAsync(city => Promise.resolve(city !== ''))
      );
      const validator = createValidator<Person>().ruleForEach('orders', setValidatorAsync(orderValidator));
      const result = await validator.validateAsync(createPersonWith());

      expectResultValid(result);
    });

    it('should fail validation for invalid nested array with child validator', async () => {
      const orderValidator = createValidator<Order>().ruleFor(
        'productName',
        mustAsync(city => Promise.resolve(city !== ''))
      );
      const validator = createValidator<Person>().ruleForEach('orders', setValidatorAsync(orderValidator));
      const result = await testValidateAsync(validator, createPersonWith({ orders: [createOrderWith({ productName: '' })] }));

      expectResultInvalid(result);
      result.shouldHaveValidationErrorFor('orders[0].productName');
    });
  });
});
