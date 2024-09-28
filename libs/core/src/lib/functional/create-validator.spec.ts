import { createPersonWith } from '../testing/test-data';
import { Person } from '../testing/test-models';
import { createValidator } from './create-validator';
import { AsyncValidatorInvokedSynchronouslyError } from './errors/async-validator-invoked-synchronously-error';
import { testValidate, testValidateAsync } from './testing/src/test-validate';
import { SyncValidation } from './types/types';
import { equals, greaterThanOrEquals, isTrue, matches, maxLength, minLength, must, mustAsync, notEquals, notNull } from './validations';

describe(createValidator.name, () => {
  describe('validate should return result', () => {
    it('should validate object and return result', () => {
      const val = createValidator<Person>().ruleFor('name', minLength(1));

      const result = testValidate(val, createPersonWith({ name: '' }));
      expect(result.isValid).toBe(false);
      expect(result.failures).toHaveLength(1);

      result.shouldHaveValidationErrorFor('name').withMessage('Value must have a minimum length of 1.').withSeverity('Error');
    });

    it('should validate multiple rules and return result', () => {
      const val = createValidator<Person>()
        .ruleFor('name', minLength(6))
        .ruleFor('age', notEquals<number, Person>(0))
        .ruleFor('registred', isTrue());

      const result = testValidate(val, createPersonWith({ name: 'world', age: 0, registred: false }));
      expect(result.isValid).toBe(false);
      expect(result.failures).toHaveLength(3);

      result.shouldHaveValidationErrorFor('name').withMessage('Value must have a minimum length of 6.').withSeverity('Error');
      result.shouldHaveValidationErrorFor('age').withMessage('Value must not equal 0.').withSeverity('Error');
      result.shouldHaveValidationErrorFor('registred').withMessage('Value must be true.').withSeverity('Error');
    });
  });

  describe('ruleFor', () => {
    it('should add rule', () => {
      const val = createValidator<Person>().ruleFor('name', minLength(6));

      expect(val.validations).toEqual({ name: [expect.any(Function)] });
      expect(val.validations.name.length).toBe(1);
    });

    it('should add multiple rules', () => {
      const val = createValidator<Person>().ruleFor('name', minLength(6), matches(/hello/));

      expect(val.validations).toEqual({ name: [expect.any(Function), expect.any(Function)] });
      expect(val.validations.name.length).toBe(2);
    });

    it('should work with custom validations', () => {
      function shouldNotStartWith<TModel>(referenceValue: string): SyncValidation<string, TModel> {
        return must((value: string) => !value.startsWith(referenceValue), `The value shall not start with ${referenceValue}.`);
      }

      const validator = createValidator<Person>().ruleFor('name', shouldNotStartWith('John'));
      const result = testValidate(validator, createPersonWith({ name: 'John Doe' }));
      expect(result.isValid).toBe(false);
      expect(result.failures).toHaveLength(1);

      result.shouldHaveValidationErrorFor('name').withMessage('The value shall not start with John.').withSeverity('Error');
    });
  });

  describe('include', () => {
    it('should include validator', () => {
      const personAgeValidator = createValidator<Person>().ruleFor('age', greaterThanOrEquals(18));

      const personNameValidator = createValidator<Person>().ruleFor('name', notNull());

      const personValidator = createValidator<Person>().include(personAgeValidator).include(personNameValidator);

      expect(personValidator.validations).toEqual({ name: [expect.any(Function)], age: [expect.any(Function)] });
      expect(personValidator.validations.name.length).toBe(1);
      expect(personValidator.validations.age.length).toBe(1);
    });
  });

  describe('validatorConfig', () => {
    describe('throwOnFailures', () => {
      it('should throw on failures', () => {
        const val = createValidator<Person>({ throwOnFailures: true }).ruleFor('name', minLength(6));

        expect(() =>
          val.validate(
            createPersonWith({
              name: 'world'
            })
          )
        ).toThrow();
      });

      it('should not throw on failures', () => {
        const val = createValidator<Person>().ruleFor('name', minLength(6));

        expect(() =>
          val.validate(
            createPersonWith({
              name: 'world'
            })
          )
        ).not.toThrow();
      });
    });

    describe('includeProperties', () => {
      it('should include properties', () => {
        let val = createValidator<Person>({ includeProperties: ['name'] })
          .ruleFor('name', minLength(1))
          .ruleFor('age', equals<number, Person>(3));

        const person = createPersonWith({
          name: '',
          age: 5
        });
        let result = testValidate(val, person);
        expect(result.isValid).toBe(false);
        expect(result.failures).toHaveLength(1);
        result.shouldHaveValidationErrorFor('name');
        result.shouldNotHaveValidationErrorFor('age');

        val = createValidator<Person>({ includeProperties: ['name', 'age'] })
          .ruleFor('name', minLength(1))
          .ruleFor('age', equals<number, Person>(3));

        result = testValidate(val, person, config => {
          config.includeProperties = ['name', 'age'];
        });
        expect(result.isValid).toBe(false);
        expect(result.failures).toHaveLength(2);
        result.shouldHaveValidationErrorFor('name');
        result.shouldHaveValidationErrorFor('age');
      });
    });

    describe('cascadeMode', () => {
      it('should stop validation on first failure', () => {
        const val = createValidator<Person>({ cascadeMode: 'Stop' })
          .ruleFor('name', minLength(6))
          .ruleFor('age', notEquals<number, Person>(0))
          .ruleFor('registred', isTrue());

        const result = testValidate(val, createPersonWith({ name: 'world', age: 0, registred: false }));
        expect(result.isValid).toBe(false);
        expect(result.failures).toHaveLength(1);
        result.shouldHaveValidationErrorFor('name').withMessage('Value must have a minimum length of 6.').withSeverity('Error');
        result.shouldNotHaveValidationErrorFor('age');
        result.shouldNotHaveValidationErrorFor('registred');
      });

      it('should continue validation on failure', () => {
        const val = createValidator<Person>({ cascadeMode: 'Continue' })
          .ruleFor('name', minLength(6))
          .ruleFor('age', notEquals<number, Person>(0))
          .ruleFor('registred', isTrue());

        const result = testValidate(val, createPersonWith({ name: 'world', age: 0, registred: false }));
        expect(result.isValid).toBe(false);
        expect(result.failures).toHaveLength(3);
        result.shouldHaveValidationErrorFor('name').withMessage('Value must have a minimum length of 6.').withSeverity('Error');
        result.shouldHaveValidationErrorFor('age').withMessage('Value must not equal 0.').withSeverity('Error');
        result.shouldHaveValidationErrorFor('registred').withMessage('Value must be true.').withSeverity('Error');
      });
    });
  });

  describe('rule conditions', () => {
    describe('synchronous conditions', () => {
      it('should not run validation when when condition is false', () => {
        const val = createValidator<Person>().ruleFor(
          'age',
          equals<number, Person>(3).when(model => model.age > 30)
        );

        const result = val.validate(createPersonWith({ age: 3 }));
        expect(result.isValid).toBe(true);
      });

      it('should run validation when when condition is true', () => {
        const val = createValidator<Person>().ruleFor(
          'age',
          equals<number, Person>(3).when(model => model.age > 30)
        );

        const result = testValidate(val, createPersonWith({ age: 31 }));
        expect(result.isValid).toBe(false);
        expect(result.failures).toHaveLength(1);
        result.shouldHaveValidationErrorFor('age').withMessage('Value must equal 3.').withSeverity('Error');
      });

      it('should run unless validation when unless condition is false', () => {
        const val = createValidator<Person>().ruleFor(
          'age',
          equals<number, Person>(3).unless(model => model.age > 30)
        );

        const result = val.validate(createPersonWith({ age: 31 }));
        expect(result.isValid).toBe(true);
      });

      it('should not run unless validation when unless condition is true', () => {
        const val = createValidator<Person>().ruleFor(
          'age',
          equals<number, Person>(3).unless(model => model.age > 30)
        );

        const result = testValidate(val, createPersonWith({ age: 4 }));
        expect(result.isValid).toBe(false);
        expect(result.failures).toHaveLength(1);
        result.shouldHaveValidationErrorFor('age').withMessage('Value must equal 3.').withSeverity('Error');
      });
    });

    describe('asynchronous conditions', () => {
      it('should not run validation when whenAsync condition is false', async () => {
        const val = createValidator<Person>().ruleFor(
          'age',
          equals<number, Person>(3).whenAsync(model => Promise.resolve(model.age > 30))
        );

        const result = await val.validateAsync(createPersonWith({ age: 3 }));
        expect(result.isValid).toBe(true);
      });

      it('should run validation when whenAsync condition is true', async () => {
        const val = createValidator<Person>().ruleFor(
          'age',
          equals<number, Person>(3).whenAsync(model => Promise.resolve(model.age > 30))
        );

        const result = await testValidateAsync(val, createPersonWith({ age: 31 }));
        expect(result.isValid).toBe(false);
        expect(result.failures).toHaveLength(1);
        result.shouldHaveValidationErrorFor('age').withMessage('Value must equal 3.').withSeverity('Error');
      });

      it('should run unless validation when unlessAsync condition is false', async () => {
        const val = createValidator<Person>().ruleFor(
          'age',
          equals<number, Person>(3).unlessAsync(model => Promise.resolve(model.age > 30))
        );

        const result = await val.validateAsync(createPersonWith({ age: 31 }));
        expect(result.isValid).toBe(true);
      });

      it('should not run unless validation when unlessAsync condition is true', async () => {
        const val = createValidator<Person>().ruleFor(
          'age',
          equals<number, Person>(3).unlessAsync(model => Promise.resolve(model.age > 30))
        );

        const result = await testValidateAsync(val, createPersonWith({ age: 4 }));
        expect(result.isValid).toBe(false);
        expect(result.failures).toHaveLength(1);
        result.shouldHaveValidationErrorFor('age').withMessage('Value must equal 3.').withSeverity('Error');
      });
    });

    describe('ApplyConditionTo', () => {
      it('should apply condition to all validators', () => {
        const val = createValidator<Person>().ruleFor(
          'name',
          maxLength(6),
          matches(/hello/).when(model => model.age > 30)
        );

        const result = testValidate(val, createPersonWith({ name: 'John Doe', age: 31 }));
        expect(result.isValid).toBe(false);
        expect(result.failures).toHaveLength(2);
        result.shouldHaveValidationErrorFor('name').withMessage('Value must have a maximum length of 6.').withSeverity('Error');
        result.shouldHaveValidationErrorFor('name').withMessage('Value must match pattern.').withSeverity('Error');
      });

      it('should apply condition to current validator only', () => {
        const val = createValidator<Person>().ruleFor(
          'name',
          maxLength(6),
          matches(/hello/).when(model => model.age > 35, 'CurrentValidator')
        );

        const result = testValidate(val, createPersonWith({ name: 'John Doe', age: 31 }));
        expect(result.isValid).toBe(false);
        expect(result.failures).toHaveLength(1);
        result.shouldHaveValidationErrorFor('name').withMessage('Value must have a maximum length of 6.').withSeverity('Error');
      });
    });
  });

  describe('rule cascading', () => {
    it('should stop validation on first failure', () => {
      const val = createValidator<Person>().ruleFor('name', 'Stop', minLength(6), equals<string, Person>('hello'));

      const result = testValidate(val, createPersonWith({ name: 'world' }));
      expect(result.isValid).toBe(false);
      expect(result.failures).toHaveLength(1);
      result.shouldHaveValidationErrorFor('name').withMessage('Value must have a minimum length of 6.').withSeverity('Error');
    });

    it('should continue validation on failure', () => {
      const val = createValidator<Person>().ruleFor('name', minLength(6), equals<string, Person>('hello'));

      const result = testValidate(val, createPersonWith({ name: 'world' }));
      expect(result.isValid).toBe(false);
      expect(result.failures).toHaveLength(2);
      result.shouldHaveValidationErrorFor('name').withMessage('Value must have a minimum length of 6.').withSeverity('Error');
      result.shouldHaveValidationErrorFor('name').withMessage('Value must equal hello.').withSeverity('Error');
    });
  });

  describe('throw error when async is called sync', () => {
    it('should throw when async validation is called synchronously', () => {
      const val = createValidator<Person>().ruleFor(
        'name',
        mustAsync(name => Promise.resolve(name.startsWith('J')))
      );

      expect(() => val.validate(createPersonWith({ name: 'John Doe', age: 31 }))).toThrow(AsyncValidatorInvokedSynchronouslyError);
    });

    it('should throw when async condition is called synchronously', () => {
      const val = createValidator<Person>().ruleFor(
        'age',
        equals<number, Person>(3).whenAsync(model => Promise.resolve(model.age > 30))
      );

      expect(() => val.validate(createPersonWith({ name: 'John Doe', age: 31 }))).toThrow(AsyncValidatorInvokedSynchronouslyError);
    });
  });
});
