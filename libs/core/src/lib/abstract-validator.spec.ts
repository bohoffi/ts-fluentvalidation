import { AbstractValidator } from './abstract-validator';
import { createValidator } from './create-validator';
import { MemberExpression } from './models';
import { createCompanyWith, createEmployeeWith, createOrderWith, createPersonWith } from './testing/test-data';
import { Address, Company, Employee, Order, Person } from './testing/test-models';
import { KeyOf } from './ts-helpers';
import { ValidationContext } from './validation-context';
import { testValidate, testValidateAsync } from '../testing';

class PersonValidator extends AbstractValidator<Person> {
  constructor() {
    super();
  }
}

let personValidator: PersonValidator;

describe(AbstractValidator.name, () => {
  beforeEach(() => {
    personValidator = new PersonValidator();
  });

  describe('validate', () => {
    it('should return `isValid === true` if the value is valid', () => {
      personValidator.ruleFor(p => p.name).notEmpty();
      const result = personValidator.validate(createPersonWith());
      expect(result.isValid).toBeTruthy();
    });

    it('should return `isValid === false` if the value is invalid', () => {
      personValidator.ruleFor(p => p.name).notEmpty();
      const result = testValidate(
        personValidator,
        createPersonWith({
          name: ''
        })
      );
      expect(result.isValid).toBeFalsy();
    });

    it('should expose the failures via the `errors` property', () => {
      personValidator.ruleFor(p => p.name).notEmpty();
      const result = testValidate(
        personValidator,
        createPersonWith({
          name: ''
        })
      );
      expect(result.errors).toHaveLength(1);
    });

    it("should be stateless (multiple `validate` calls won't produce duplicated failures)", () => {
      personValidator.ruleFor(p => p.name).notEmpty();
      const invalidPerson = createPersonWith({
        name: ''
      });
      personValidator.validate(invalidPerson);
      const result = personValidator.validate(invalidPerson);
      expect(result.errors).toHaveLength(1);
    });

    it('should validate using validation context', () => {
      personValidator.ruleFor(p => p.name).notEmpty();
      const testContext: ValidationContext<Person> = new ValidationContext(createPersonWith({ name: '' }));
      const result = personValidator.validate(testContext);
      expect(result.isValid).toBeFalsy();
    });

    it('should throw an error when called with asynchronous rules defined', () => {
      const validatorWithAsyncRule = createValidator<Person>(validator =>
        validator.ruleFor(p => p.name).mustAsync(() => Promise.resolve(true))
      );

      expect(() => {
        validatorWithAsyncRule.validate(createPersonWith());
      }).toThrow(
        `Validator for property 'name' contains asynchronous rules but was invoked synchronously. Please call 'validateAsync' rather than 'validate'.`
      );
    });
  });

  describe('validateAsync', () => {
    it('should return `isValid === true` if the value is valid', async () => {
      personValidator.ruleFor(p => p.name).notEmpty();
      const result = await personValidator.validateAsync(createPersonWith());
      expect(result.isValid).toBeTruthy();
    });

    it('should return `isValid === false` if the value is invalid', async () => {
      personValidator.ruleFor(p => p.name).notEmpty();
      const result = await testValidateAsync(
        personValidator,
        createPersonWith({
          name: ''
        })
      );
      expect(result.isValid).toBeFalsy();
    });

    it('should expose the failures via the `errors` property', async () => {
      personValidator.ruleFor(p => p.name).notEmpty();
      const result = await testValidateAsync(
        personValidator,
        createPersonWith({
          name: ''
        })
      );
      expect(result.errors).toHaveLength(1);
    });

    it("should be stateless (multiple `validateAsync` calls won't produce duplicated failures)", async () => {
      personValidator.ruleFor(p => p.name).notEmpty();
      const invalidPerson = createPersonWith({
        name: ''
      });
      await personValidator.validateAsync(invalidPerson);
      const result = await personValidator.validateAsync(invalidPerson);
      expect(result.errors).toHaveLength(1);
    });

    it('should validate using validation context', async () => {
      personValidator.ruleFor(p => p.name).notEmpty();
      const testContext: ValidationContext<Person> = new ValidationContext(createPersonWith({ name: '' }));
      const result = await personValidator.validateAsync(testContext);
      expect(result.isValid).toBeFalsy();
    });
  });

  describe('name / message overrides', () => {
    it('should override the default error message using `withMessage`', () => {
      personValidator
        .ruleFor(p => p.name)
        .notEmpty()
        .withMessage('Name is required');
      const result = testValidate(
        personValidator,
        createPersonWith({
          name: ''
        })
      );
      result.shouldHaveValidationErrorFor(p => p.name).withMessage('Name is required');
    });

    it('should override the property name using `withName`', () => {
      personValidator
        .ruleFor(p => p.name)
        .notEmpty()
        .withName('Person Name');
      const result = testValidate(
        personValidator,
        createPersonWith({
          name: ''
        })
      );
      result.shouldHaveValidationErrorFor(p => p.name).withMessage('Person Name must not be empty.');
    });
  });

  describe('invalid member expression / property name', () => {
    it('should throw `Invalid MemberExpression` error given an invalid member expression', () => {
      const memberExpression = ((p: Person) => p) as unknown as MemberExpression<Person, string>;
      const expressionString = memberExpression.toString();

      expect(() => {
        personValidator.ruleFor(memberExpression).notEmpty();
      }).toThrow(`Invalid MemberExpression: '${expressionString}'`);
    });

    it('should throw `Invalid member expression or property name` error given an invalid property name', () => {
      const invalidPropertyName = '';

      expect(() => {
        personValidator.ruleFor(invalidPropertyName as KeyOf<Person>).null();
      }).toThrow(`Invalid member expression or property name: ${invalidPropertyName.toString()}`);
    });
  });

  describe('severity', () => {
    it('should set the severity using `withSeverity`', () => {
      personValidator
        .ruleFor(p => p.name)
        .notEmpty()
        .withSeverity('Warning');
      const result = testValidate(
        personValidator,
        createPersonWith({
          name: ''
        })
      );
      result.shouldHaveValidationErrorFor(p => p.name).withSeverity('Warning');
    });

    it('should set the severity using a provider function', () => {
      personValidator
        .ruleFor(p => p.name)
        .notEmpty()
        .withSeverity(p => (p.name.length === 0 ? 'Warning' : 'Error'));
      const result = testValidate(
        personValidator,
        createPersonWith({
          name: ''
        })
      );
      result.shouldHaveValidationErrorFor(p => p.name).withSeverity('Warning');
    });

    it('should set the severity using a provider function with additional parameters', () => {
      personValidator
        .ruleFor(p => p.name)
        .notEmpty()
        .withSeverity((person, value: string) => (person.age && value ? 'Warning' : 'Error'));
      const result = testValidate(
        personValidator,
        createPersonWith({
          name: ''
        })
      );
      result.shouldHaveValidationErrorFor(p => p.name).withSeverity('Error');
    });

    it('should set the severity using a provider function with additional parameters and context', () => {
      personValidator
        .ruleFor(p => p.name)
        .notEmpty()
        .withSeverity((person: Person, value: string, context: ValidationContext<Person>) =>
          person.age && value && !context.failues.length ? 'Warning' : 'Error'
        );
      const result = testValidate(
        personValidator,
        createPersonWith({
          name: ''
        })
      );
      result.shouldHaveValidationErrorFor(p => p.name).withSeverity('Error');
    });
  });

  describe('error code', () => {
    it('should set the error code using `withErrorCode`', () => {
      personValidator
        .ruleFor(p => p.name)
        .notEmpty()
        .withErrorCode('ERR1234');
      const result = testValidate(
        personValidator,
        createPersonWith({
          name: ''
        })
      );
      result.shouldHaveValidationErrorFor(p => p.name).withErrorCode('ERR1234');
    });

    it('should fall back to default error message with custom error code and no custom message provided', () => {
      personValidator
        .ruleFor(p => p.name)
        .notEmpty()
        .withErrorCode('ERR1234');
      const result = testValidate(
        personValidator,
        createPersonWith({
          name: ''
        })
      );
      result.shouldHaveValidationErrorFor(p => p.name).withMessage('name must not be empty.');
    });

    it('should use custom message with custom error code', () => {
      personValidator
        .ruleFor(p => p.name)
        .notEmpty()
        .withMessage('Custom message')
        .withErrorCode('ERR1234');
      const result = testValidate(
        personValidator,
        createPersonWith({
          name: ''
        })
      );
      result.shouldHaveValidationErrorFor(p => p.name).withMessage('Custom message');
    });

    it('should output other rules message with custom error code matching the other rules name', () => {
      personValidator
        .ruleFor(p => p.name)
        .notEmpty()
        .withErrorCode('NotNullRule');
      const result = testValidate(
        personValidator,
        createPersonWith({
          name: ''
        })
      );
      result.shouldHaveValidationErrorFor(p => p.name).withMessage('name must not be null.');
    });
  });

  describe('collection properties', () => {
    it('should validate collection properties', () => {
      const person = createPersonWith({
        pets: ['dog', 'cat', 'fish']
      });

      personValidator.ruleForEach('pets').maxLength(3);
      const result = testValidate(personValidator, person);
      expect(result.isValid).toBeFalsy();
      expect(result.errors).toHaveLength(1);
      expect(result.errors[0].propertyName).toBe('pets[2]');
      result.shouldHaveValidationErrorFor('pets[2]').withMessage('pets[2] must have a maximum length of 3.');
    });

    it('should validate complex collection properties', () => {
      const company = createCompanyWith({
        employees: [
          createEmployeeWith(),
          createEmployeeWith({
            name: '',
            areas: []
          })
        ]
      });
      const employeeValidator = createValidator<Employee>(validator => {
        validator.ruleFor(e => e.name).notEmpty();
        validator.ruleFor('areas').notEmpty();
      });
      const companyValidator = createValidator<Company>(validator => {
        validator.ruleFor(c => c.name).notEmpty();
        validator.ruleForEach('employees').setValidator(employeeValidator);
      });

      const result = testValidate(companyValidator, company);
      expect(result.isValid).toBeFalsy();
      expect(result.errors).toHaveLength(2);
      result.shouldHaveValidationErrorFor('employees[1].name');
      result.shouldHaveValidationErrorFor('employees[1].areas');
    });
  });

  describe('custom rules', () => {
    it('should return single failre with custom rule', () => {
      const person = createPersonWith({
        name: 'John Doe'
      });

      personValidator
        .ruleFor(p => p.name)
        .custom((name, context) => {
          context.addFailure('name', 'Fail');
        });

      const result = testValidate(personValidator, person);
      expect(result.isValid).toBeFalsy();
      result.shouldHaveValidationErrorFor('name').withMessage('Fail');
    });

    it('should return single failre with custom async rule', async () => {
      const person = createPersonWith({
        name: 'John Doe'
      });

      personValidator
        .ruleFor(p => p.name)
        .customAsync((name, context) => {
          context.addFailure('name', 'Fail');
          return Promise.resolve();
        });

      const result = await testValidateAsync(personValidator, person);
      expect(result.isValid).toBeFalsy();
      result.shouldHaveValidationErrorFor('name').withMessage('Fail');
    });

    it('preserves property chain using custom nested', () => {
      const orderValidator = createValidator<Order>(val => {
        val.ruleFor('total').custom((total, context) => {
          context.addFailure('total', 'Fail');
        });
      });
      personValidator.ruleForEach('orders').setValidator(orderValidator);

      const person = createPersonWith({
        orders: [
          createOrderWith({
            total: 10
          })
        ]
      });

      const result = testValidate(personValidator, person);
      expect(result.isValid).toBeFalsy();
      result.shouldHaveValidationErrorFor('orders[0].total').withMessage('Fail');
    });

    it('should infer property name when omitted on custom', () => {
      const person = createPersonWith({
        name: 'John Doe'
      });

      personValidator
        .ruleFor(p => p.name)
        .custom((name, context) => {
          context.addFailure('Fail');
        });

      const result = testValidate(personValidator, person);
      expect(result.isValid).toBeFalsy();
      result.shouldHaveValidationErrorFor('name').withMessage('Fail');
    });

    it('should infer nested property name when omitted on custom', () => {
      const person = createPersonWith({
        name: 'John Doe'
      });

      const addressValidator = createValidator<Address>(val => {
        val.ruleFor('city').custom((city, context) => {
          context.addFailure('Fail');
        });
      });

      personValidator.ruleFor(p => p.address).setValidator(addressValidator);

      const result = testValidate(personValidator, person);
      expect(result.isValid).toBeFalsy();
      result.shouldHaveValidationErrorFor('address.city').withMessage('Fail');
    });

    // TODO #33
    // it('should use empty property name on custom for model level', () => {
    //   const person = createPersonWith();
    //   personValidator
    //     .ruleFor(p => p)
    //     .custom((person, context) => {
    //       context.addFailure('Fail');
    //     });

    //   const result = testValidate(personValidator, person);
    //   expect(result.isValid).toBeFalsy();
    //   expect(result.errors[0].propertyName).toEqual('');
    // });

    it('should support placeholders', () => {
      const person = createPersonWith();
      personValidator.ruleFor('name').custom((name, context) => {
        context.messageFormatter.appendOrUpdateArgument('Foo', '1');
        context.addFailure('{Foo}');
      });

      const result = testValidate(personValidator, person);
      expect(result.isValid).toBeFalsy();
      result.shouldHaveValidationErrorFor('name').withMessage('1');
    });
  });
});
