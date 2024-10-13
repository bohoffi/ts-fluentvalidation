import { createValidator } from '../lib/create-validator';
import { greaterThanOrEquals, minLength, notEmpty } from '../lib/validations';
import { testValidate, testValidateAsync } from '../testing/src/test-validate';
import { expectFailureLength, expectResultInvalid } from './assertions';
import { createPersonWith, Person } from './fixtures';

describe('ValidatorConfig', () => {
  describe('includeProperties', () => {
    const testPerson = createPersonWith({ firstName: '', lastName: '', age: 17 });
    describe('createValidator() - config - includeProperties', () => {
      it('should validate included property only', () => {
        const validator = createValidator<Person>({
          includeProperties: 'firstName'
        })
          .ruleFor('firstName', notEmpty())
          .ruleFor('lastName', notEmpty());

        const result = testValidate(validator, testPerson);
        expectResultInvalid(result);
        expectFailureLength(result, 1);
        result.shouldHaveValidationErrorFor('firstName');
        result.shouldNotHaveValidationErrorFor('lastName');
      });

      it('should validate included properties only', () => {
        const validator = createValidator<Person>({
          includeProperties: ['firstName', 'lastName']
        })
          .ruleFor('firstName', notEmpty())
          .ruleFor('lastName', notEmpty())
          .ruleFor('age', greaterThanOrEquals(18));

        const result = testValidate(validator, testPerson);
        expectResultInvalid(result);
        expectFailureLength(result, 2);
        result.shouldHaveValidationErrorFor('firstName');
        result.shouldHaveValidationErrorFor('lastName');
      });

      it('should include properties overwritten by validate() call', () => {
        const validator = createValidator<Person>({
          includeProperties: 'firstName'
        })
          .ruleFor('firstName', notEmpty())
          .ruleFor('lastName', notEmpty());

        const result = testValidate(validator, testPerson, config => (config.includeProperties = ['firstName', 'lastName']));
        expectResultInvalid(result);
        expectFailureLength(result, 2);
        result.shouldHaveValidationErrorFor('firstName');
        result.shouldHaveValidationErrorFor('lastName');
      });

      it('should include properties overwritten by validateAsync() call', async () => {
        const validator = createValidator<Person>({
          includeProperties: 'firstName'
        })
          .ruleFor('firstName', notEmpty())
          .ruleFor('lastName', notEmpty());

        const result = await testValidateAsync(validator, testPerson, config => (config.includeProperties = ['firstName', 'lastName']));
        expectResultInvalid(result);
        expectFailureLength(result, 2);
        result.shouldHaveValidationErrorFor('firstName');
        result.shouldHaveValidationErrorFor('lastName');
      });
    });

    describe('validate() - config - includeProperties', () => {
      it('should validate included property only', () => {
        const validator = createValidator<Person>().ruleFor('firstName', notEmpty()).ruleFor('lastName', notEmpty());

        const result = testValidate(validator, testPerson, config => (config.includeProperties = 'firstName'));
        expectResultInvalid(result);
        expectFailureLength(result, 1);
        result.shouldHaveValidationErrorFor('firstName');
        result.shouldNotHaveValidationErrorFor('lastName');
      });

      it('should validate included properties only', () => {
        const validator = createValidator<Person>()
          .ruleFor('firstName', notEmpty())
          .ruleFor('lastName', notEmpty())
          .ruleFor('age', greaterThanOrEquals(18));

        const result = testValidate(validator, testPerson, config => (config.includeProperties = ['firstName', 'lastName']));
        expectResultInvalid(result);
        expectFailureLength(result, 2);
        result.shouldHaveValidationErrorFor('firstName');
        result.shouldHaveValidationErrorFor('lastName');
      });
    });

    describe('validateAsync() - config - includeProperties', () => {
      it('should validate included property only', async () => {
        const validator = createValidator<Person>().ruleFor('firstName', notEmpty()).ruleFor('lastName', notEmpty());

        const result = await testValidateAsync(validator, testPerson, config => (config.includeProperties = 'firstName'));
        expectResultInvalid(result);
        expectFailureLength(result, 1);
        result.shouldHaveValidationErrorFor('firstName');
        result.shouldNotHaveValidationErrorFor('lastName');
      });

      it('should validate included properties only', async () => {
        const validator = createValidator<Person>()
          .ruleFor('firstName', notEmpty())
          .ruleFor('lastName', notEmpty())
          .ruleFor('age', greaterThanOrEquals(18));

        const result = await testValidateAsync(validator, testPerson, config => (config.includeProperties = ['firstName', 'lastName']));
        expectResultInvalid(result);
        expectFailureLength(result, 2);
        result.shouldHaveValidationErrorFor('firstName');
        result.shouldHaveValidationErrorFor('lastName');
      });
    });
  });

  describe('cascadeMode', () => {
    const testPerson = createPersonWith({ firstName: '', lastName: '', age: 17 });
    describe('createValidator() - config - cascadeMode', () => {
      it('should stop synchronous validation on first failure with cascadeMode set to Stop', () => {
        const validator = createValidator<Person>({ cascadeMode: 'Stop' })
          .ruleFor('firstName', notEmpty())
          .ruleFor('lastName', notEmpty())
          .ruleFor('age', greaterThanOrEquals(18));

        const result = testValidate(validator, testPerson);
        expectResultInvalid(result);
        expectFailureLength(result, 1);
        result.shouldHaveValidationErrorFor('firstName');
        result.shouldNotHaveValidationErrorFor('lastName');
        result.shouldNotHaveValidationErrorFor('age');
      });

      it('should continue synchronous validation on failure with cascadeMode set to Continue or undefined', () => {
        const validator = createValidator<Person>({ cascadeMode: 'Continue' })
          .ruleFor('firstName', notEmpty())
          .ruleFor('lastName', notEmpty())
          .ruleFor('age', greaterThanOrEquals(18));

        const result = testValidate(validator, testPerson);
        expectResultInvalid(result);
        expectFailureLength(result, 3);
        result.shouldHaveValidationErrorFor('firstName');
        result.shouldHaveValidationErrorFor('lastName');
        result.shouldHaveValidationErrorFor('age');
      });

      it('should stop asynchronous validation on first failure with cascadeMode set to Stop', async () => {
        const validator = createValidator<Person>({ cascadeMode: 'Stop' })
          .ruleFor('firstName', notEmpty())
          .ruleFor('lastName', notEmpty())
          .ruleFor('age', greaterThanOrEquals(18));

        const result = await testValidateAsync(validator, testPerson);
        expectResultInvalid(result);
        expectFailureLength(result, 1);
        result.shouldHaveValidationErrorFor('firstName');
        result.shouldNotHaveValidationErrorFor('lastName');
        result.shouldNotHaveValidationErrorFor('age');
      });

      it('should continue asynchronous validation on failure with cascadeMode set to Continue or undefined', async () => {
        const validator = createValidator<Person>({ cascadeMode: 'Continue' })
          .ruleFor('firstName', notEmpty())
          .ruleFor('lastName', notEmpty())
          .ruleFor('age', greaterThanOrEquals(18));

        const result = await testValidateAsync(validator, testPerson);
        expectResultInvalid(result);
        expectFailureLength(result, 3);
        result.shouldHaveValidationErrorFor('firstName');
        result.shouldHaveValidationErrorFor('lastName');
        result.shouldHaveValidationErrorFor('age');
      });

      it('should continue validation on first failure when cascadeMode is overwritten by validate() call', () => {
        const validator = createValidator<Person>({ cascadeMode: 'Stop' })
          .ruleFor('firstName', notEmpty())
          .ruleFor('lastName', notEmpty())
          .ruleFor('age', greaterThanOrEquals(18));

        const result = testValidate(validator, testPerson, config => (config.cascadeMode = 'Continue'));
        expectResultInvalid(result);
        expectFailureLength(result, 3);
        result.shouldHaveValidationErrorFor('firstName');
        result.shouldHaveValidationErrorFor('lastName');
        result.shouldHaveValidationErrorFor('age');
      });

      it('should continue validation on first failure when cascadeMode is overwritten by validateAsync() call', async () => {
        const validator = createValidator<Person>({ cascadeMode: 'Stop' })
          .ruleFor('firstName', notEmpty())
          .ruleFor('lastName', notEmpty())
          .ruleFor('age', greaterThanOrEquals(18));

        const result = await testValidateAsync(validator, testPerson, config => (config.cascadeMode = 'Continue'));
        expectResultInvalid(result);
        expectFailureLength(result, 3);
        result.shouldHaveValidationErrorFor('firstName');
        result.shouldHaveValidationErrorFor('lastName');
        result.shouldHaveValidationErrorFor('age');
      });
    });

    describe('validate() - config - cascadeMode', () => {
      it('should stop synchronous validation on first failure with cascadeMode set to Stop', () => {
        const validator = createValidator<Person>()
          .ruleFor('firstName', notEmpty())
          .ruleFor('lastName', notEmpty())
          .ruleFor('age', greaterThanOrEquals(18));

        const result = testValidate(validator, testPerson, config => (config.cascadeMode = 'Stop'));
        expectResultInvalid(result);
        expectFailureLength(result, 1);
        result.shouldHaveValidationErrorFor('firstName');
        result.shouldNotHaveValidationErrorFor('lastName');
        result.shouldNotHaveValidationErrorFor('age');
      });

      it('should continue synchronous validation on failure with cascadeMode set to Continue or undefined', () => {
        const validator = createValidator<Person>()
          .ruleFor('firstName', notEmpty())
          .ruleFor('lastName', notEmpty())
          .ruleFor('age', greaterThanOrEquals(18));

        const result = testValidate(validator, testPerson, config => (config.cascadeMode = 'Continue'));
        expectResultInvalid(result);
        expectFailureLength(result, 3);
        result.shouldHaveValidationErrorFor('firstName');
        result.shouldHaveValidationErrorFor('lastName');
        result.shouldHaveValidationErrorFor('age');
      });
    });

    describe('validateAsync() - config - cascadeMode', () => {
      it('should stop asynchronous validation on first failure with cascadeMode set to Stop', async () => {
        const validator = createValidator<Person>()
          .ruleFor('firstName', notEmpty())
          .ruleFor('lastName', notEmpty())
          .ruleFor('age', greaterThanOrEquals(18));

        const result = await testValidateAsync(validator, testPerson, config => (config.cascadeMode = 'Stop'));
        expectResultInvalid(result);
        expectFailureLength(result, 1);
        result.shouldHaveValidationErrorFor('firstName');
        result.shouldNotHaveValidationErrorFor('lastName');
        result.shouldNotHaveValidationErrorFor('age');
      });

      it('should continue asynchronous validation on failure with cascadeMode set to Continue or undefined', async () => {
        const validator = createValidator<Person>()
          .ruleFor('firstName', notEmpty())
          .ruleFor('lastName', notEmpty())
          .ruleFor('age', greaterThanOrEquals(18));

        const result = await testValidateAsync(validator, testPerson, config => (config.cascadeMode = 'Continue'));
        expectResultInvalid(result);
        expectFailureLength(result, 3);
        result.shouldHaveValidationErrorFor('firstName');
        result.shouldHaveValidationErrorFor('lastName');
        result.shouldHaveValidationErrorFor('age');
      });
    });
  });

  describe('propertyCascadeMode', () => {
    const testPerson = createPersonWith({ firstName: '', lastName: '', age: 17 });
    describe('createValidator() - config - propertyCascadeMode', () => {
      it('should stop synchronous validation on first failure with propertyCascadeMode set to Stop', () => {
        const validator = createValidator<Person>({ propertyCascadeMode: 'Stop' }).ruleFor('firstName', notEmpty(), minLength(1));

        const result = testValidate(validator, testPerson);
        expectResultInvalid(result);
        expectFailureLength(result, 1);
        result.shouldHaveValidationErrorFor('firstName').withMessage(`'firstName' must not be empty.`);
      });

      it('should continue synchronous validation on failure with propertyCascadeMode set to Continue or undefined', () => {
        const validator = createValidator<Person>({ propertyCascadeMode: 'Continue' }).ruleFor('firstName', notEmpty(), minLength(1));

        const result = testValidate(validator, testPerson);
        expectResultInvalid(result);
        expectFailureLength(result, 2);
        result.shouldHaveValidationErrorFor('firstName').withMessage(`'firstName' must not be empty.`);
        result.shouldHaveValidationErrorFor('firstName').withMessage(`'firstName' must have a minimum length of 1.`);
      });

      it('should stop asynchronous validation on first failure with propertyCascadeMode set to Stop', async () => {
        const validator = createValidator<Person>({ propertyCascadeMode: 'Stop' }).ruleFor('firstName', notEmpty(), minLength(1));

        const result = await testValidateAsync(validator, testPerson);
        expectResultInvalid(result);
        expectFailureLength(result, 1);
        result.shouldHaveValidationErrorFor('firstName').withMessage(`'firstName' must not be empty.`);
      });

      it('should continue asynchronous validation on failure with propertyCascadeMode set to Continue or undefined', async () => {
        const validator = createValidator<Person>({ propertyCascadeMode: 'Continue' }).ruleFor('firstName', notEmpty(), minLength(1));

        const result = await testValidateAsync(validator, testPerson);
        expectResultInvalid(result);
        expectFailureLength(result, 2);
        result.shouldHaveValidationErrorFor('firstName').withMessage(`'firstName' must not be empty.`);
        result.shouldHaveValidationErrorFor('firstName').withMessage(`'firstName' must have a minimum length of 1.`);
      });

      it('should continue validation on first failure when propertyCascadeMode is overwritten by validate() call', () => {
        const validator = createValidator<Person>({ propertyCascadeMode: 'Stop' }).ruleFor('firstName', notEmpty(), minLength(1));

        const result = testValidate(validator, testPerson, config => (config.propertyCascadeMode = 'Continue'));
        expectResultInvalid(result);
        expectFailureLength(result, 2);
        result.shouldHaveValidationErrorFor('firstName').withMessage(`'firstName' must not be empty.`);
        result.shouldHaveValidationErrorFor('firstName').withMessage(`'firstName' must have a minimum length of 1.`);
      });

      it('should continue validation on first failure when propertyCascadeMode is overwritten by validateAsync() call', async () => {
        const validator = createValidator<Person>({ propertyCascadeMode: 'Stop' }).ruleFor('firstName', notEmpty(), minLength(1));

        const result = await testValidateAsync(validator, testPerson, config => (config.propertyCascadeMode = 'Continue'));
        expectResultInvalid(result);
        expectFailureLength(result, 2);
        result.shouldHaveValidationErrorFor('firstName').withMessage(`'firstName' must not be empty.`);
        result.shouldHaveValidationErrorFor('firstName').withMessage(`'firstName' must have a minimum length of 1.`);
      });
    });

    describe('validate() - config - propertyCascadeMode', () => {
      it('should stop synchronous validation on first failure with propertyCascadeMode set to Stop', () => {
        const validator = createValidator<Person>().ruleFor('firstName', notEmpty(), minLength(1));

        const result = testValidate(validator, testPerson, config => (config.propertyCascadeMode = 'Stop'));
        expectResultInvalid(result);
        expectFailureLength(result, 1);
        result.shouldHaveValidationErrorFor('firstName').withMessage(`'firstName' must not be empty.`);
      });

      it('should continue synchronous validation on failure with propertyCascadeMode set to Continue or undefined', () => {
        const validator = createValidator<Person>().ruleFor('firstName', notEmpty(), minLength(1));

        const result = testValidate(validator, testPerson, config => (config.propertyCascadeMode = 'Continue'));
        expectResultInvalid(result);
        expectFailureLength(result, 2);
        result.shouldHaveValidationErrorFor('firstName').withMessage(`'firstName' must not be empty.`);
        result.shouldHaveValidationErrorFor('firstName').withMessage(`'firstName' must have a minimum length of 1.`);
      });
    });

    describe('validateAsync() - config - propertyCascadeMode', () => {
      it('should stop asynchronous validation on first failure with propertyCascadeMode set to Stop', async () => {
        const validator = createValidator<Person>().ruleFor('firstName', notEmpty(), minLength(1));

        const result = await testValidateAsync(validator, testPerson, config => (config.propertyCascadeMode = 'Stop'));
        expectResultInvalid(result);
        expectFailureLength(result, 1);
        result.shouldHaveValidationErrorFor('firstName').withMessage(`'firstName' must not be empty.`);
      });

      it('should continue asynchronous validation on failure with propertyCascadeMode set to Continue or undefined', async () => {
        const validator = createValidator<Person>().ruleFor('firstName', notEmpty(), minLength(1));

        const result = await testValidateAsync(validator, testPerson, config => (config.propertyCascadeMode = 'Continue'));
        expectResultInvalid(result);
        expectFailureLength(result, 2);
        result.shouldHaveValidationErrorFor('firstName').withMessage(`'firstName' must not be empty.`);
        result.shouldHaveValidationErrorFor('firstName').withMessage(`'firstName' must have a minimum length of 1.`);
      });
    });
  });
});
