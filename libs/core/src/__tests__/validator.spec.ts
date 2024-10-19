import { createValidator } from '../lib/create-validator';
import { ValidationError } from '../lib/errors';
import { ValidationResult } from '../lib/result';
import { ValidationContext } from '../lib/validation-context';
import {
  equals,
  greaterThanOrEquals,
  lessThanOrEquals,
  matches,
  must,
  mustAsync,
  notEmpty,
  setValidator,
  setValidatorAsync
} from '../lib/validations';
import { testValidate, testValidateAsync } from '../testing/src/test-validate';
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

    it('should add included validations to existing keys', () => {
      const personAgeValidator = createValidator<Person>().ruleFor('age', greaterThanOrEquals(18));
      const personValidator = createValidator<Person>().ruleFor('age', lessThanOrEquals(65)).include(personAgeValidator);

      expectValidationsFor(personValidator, 'age');
      expectValidationsForWithLength(personValidator, 'age', 2);
    });
  });

  describe('preValidate', () => {
    describe('pre-validation fails', () => {
      const failingPreValidation: Parameters<ReturnType<typeof createValidator<Person>>['preValidate']>[0] = (
        validationContext: ValidationContext<Person>,
        validationResult: ValidationResult
      ) => false;

      const failingPreValidationWithError: Parameters<ReturnType<typeof createValidator<Person>>['preValidate']>[0] = (
        _: ValidationContext<Person>,
        validationResult: ValidationResult
      ) => {
        validationResult.addFailures({
          message: 'Pre-validation failed',
          propertyName: 'age',
          severity: 'Error'
        });
        return false;
      };

      it('should not run validations sync', () => {
        const personValidator = createValidator<Person>().preValidate(failingPreValidation).ruleFor('age', greaterThanOrEquals(18));
        const result = personValidator.validate(createPersonWith());

        expectResultValid(result);
      });

      it('should not run validations async', async () => {
        const personValidator = createValidator<Person>().preValidate(failingPreValidation).ruleFor('age', greaterThanOrEquals(18));
        const result = await personValidator.validateAsync(createPersonWith());

        expectResultValid(result);
      });

      it('should return invalid result sync', () => {
        const personValidator = createValidator<Person>()
          .preValidate(failingPreValidationWithError)
          .ruleFor('age', greaterThanOrEquals(18));
        const result = testValidate(personValidator, createPersonWith());

        expectResultInvalid(result);
        expectFailureLength(result, 1);
        result.shouldHaveValidationErrorFor('age').withMessage('Pre-validation failed');
      });

      it('should return invalid result async', async () => {
        const personValidator = createValidator<Person>()
          .preValidate(failingPreValidationWithError)
          .ruleFor('age', greaterThanOrEquals(18));
        const result = await testValidateAsync(personValidator, createPersonWith());

        expectResultInvalid(result);
        expectFailureLength(result, 1);
        result.shouldHaveValidationErrorFor('age').withMessage('Pre-validation failed');
      });

      it('should throw on invalid pre-validation result sync', () => {
        const personValidator = createValidator<Person>()
          .preValidate(failingPreValidationWithError)
          .ruleFor('age', greaterThanOrEquals(18));

        expect(() => personValidator.validate(createPersonWith(), config => (config.throwOnFailures = true))).toThrow(ValidationError);
      });

      it('should throw on invalid pre-validation result async', async () => {
        const personValidator = createValidator<Person>()
          .preValidate(failingPreValidationWithError)
          .ruleFor('age', greaterThanOrEquals(18));

        expect(
          async () => await personValidator.validateAsync(createPersonWith(), config => (config.throwOnFailures = true))
        ).rejects.toThrow(ValidationError);
      });
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

  describe('overridePropertyName', () => {
    const invalidPerson = createPersonWith({
      lastName: '',
      address: createAddressWith({ city: '' }),
      orders: [createOrderWith({ productName: 'BAR' }), createOrderWith({ productName: 'FOO' })]
    });

    it('should override property name for single key', () => {
      const validator = createValidator<Person>().ruleFor('lastName', equals('John').overridePropertyName('foo'));

      const result = testValidate(validator, invalidPerson);

      expectResultInvalid(result);
      expectFailureLength(result, 1);
      result.shouldNotHaveValidationErrorFor('lastName');
      result.shouldHaveValidationErrorFor('foo');
    });

    it('should override property name for single key with multiple validations', () => {
      const validator = createValidator<Person>().ruleFor('lastName', equals('John').overridePropertyName('foo'), notEmpty());

      const result = testValidate(validator, invalidPerson);

      expectResultInvalid(result);
      expectFailureLength(result, 2);
      result.shouldHaveValidationErrorFor('foo').withErrorCode(equals.name);
      result.shouldHaveValidationErrorFor('foo').withErrorCode(notEmpty.name);
    });

    it('should not override property name for further `ruleFor` calls', () => {
      const validator = createValidator<Person>()
        .ruleFor('lastName', equals('John').overridePropertyName('foo'))
        .ruleFor('lastName', equals('Jane'));

      const result = testValidate(validator, invalidPerson);

      expectResultInvalid(result);
      expectFailureLength(result, 2);
      result.shouldHaveValidationErrorFor('foo').withErrorCode(equals.name);
      result.shouldHaveValidationErrorFor('lastName').withErrorCode(equals.name);
    });

    it('should override property name for child validator', () => {
      const addressValidator = createValidator<Address>().ruleFor('city', notEmpty().overridePropertyName('Stadt'));
      const validator = createValidator<Person>().ruleFor('address', setValidator(addressValidator).overridePropertyName('Anschrift'));

      const result = testValidate(validator, invalidPerson);

      expectResultInvalid(result);
      expectFailureLength(result, 1);
      result.shouldNotHaveValidationErrorFor('address');
      result.shouldHaveValidationErrorFor('Anschrift.Stadt');
    });

    it('should override property name for collection using `ruleForEach`', () => {
      const validator = createValidator<Person>().ruleForEach(
        'orders',
        must<Order, Person>(order => order.productName === 'BAR').overridePropertyName('Bestellung')
      );

      const result = testValidate(validator, invalidPerson);

      expectResultInvalid(result);
      expectFailureLength(result, 1);
      result.shouldNotHaveValidationErrorFor('orders');
      result.shouldHaveValidationErrorFor('Bestellung[1]');
    });
  });
});
