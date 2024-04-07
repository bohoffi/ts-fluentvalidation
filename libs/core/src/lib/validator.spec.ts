import { createEmployeeWith, createPersonWith } from './testing/test-data';
import { Employee, Person } from './testing/test-models';
import { createValidator } from './validator';

describe('validator', () => {
  describe(createValidator.name, () => {
    it('should create a validator object', () => {
      const validator = createValidator();

      expect(validator).toBeDefined();
      expect(validator.ruleFor).toBeDefined();
      expect(validator.validate).toBeDefined();
    });

    it('should create a validator object with initFn', () => {
      const validator = createValidator<Person>(val => {
        val.ruleFor('name').must(value => value.length > 0);
      });

      expect(validator).toBeDefined();
      expect(validator.ruleFor).toBeDefined();
      expect(validator.validate).toBeDefined();
    });

    it('should create a validator object with config', () => {
      const validator = createValidator<Person>({ validatorLevelCascadeMode: 'Stop' });

      expect(validator).toBeDefined();
      expect(validator.ruleFor).toBeDefined();
      expect(validator.validate).toBeDefined();
    });

    it('should create a validator object with config and initFn', () => {
      const validator = createValidator<Person>({ validatorLevelCascadeMode: 'Stop' }, val => {
        val.ruleFor('name').must(value => value.length > 0);
      });

      expect(validator).toBeDefined();
      expect(validator.ruleFor).toBeDefined();
      expect(validator.validate).toBeDefined();
    });
  });

  describe('ruleFor', () => {
    it('should create a rule builder for a property', () => {
      const validator = createValidator<Person>();

      const ruleBuilder = validator.ruleFor('name');

      expect(ruleBuilder).toBeDefined();
    });

    it('should create a rule builder for a member expression', () => {
      const validator = createValidator<Person>();

      const ruleBuilder = validator.ruleFor(p => p.name);

      expect(ruleBuilder).toBeDefined();
    });
  });

  describe('validate', () => {
    it('should validate an object', () => {
      const validator = createValidator<Person>(val => {
        val.ruleFor('name').must(value => value.length > 0);
      });

      const person = createPersonWith({ name: '' });

      const result = validator.validate(person);

      expect(result.isValid).toBe(false);
      expect(result.failures.length).toBe(1);
    });

    it('should validate an object with multiple rules', () => {
      const validator = createValidator<Person>(val => {
        val.ruleFor('name').must(value => value.length > 0);
        val.ruleFor('age').must(value => value > 0);
      });

      const person = createPersonWith({ name: '', age: 0 });

      const result = validator.validate(person);

      expect(result.isValid).toBe(false);
      expect(result.failures.length).toBe(2);
    });

    it('should validate an object with multiple rules and stop on first failure', () => {
      const validator = createValidator<Person>({ validatorLevelCascadeMode: 'Stop' }, val => {
        val.ruleFor('name').must(value => value.length > 0);
        val.ruleFor('age').must(value => value > 0);
      });

      const person = createPersonWith({ name: '', age: 0 });

      const result = validator.validate(person);

      expect(result.isValid).toBe(false);
      expect(result.failures.length).toBe(1);
    });

    it('should validate an object with multiple rules and stop on first failure with rule level cascade mode', () => {
      const validator = createValidator<Person>(val => {
        val
          .ruleFor('name')
          .must(value => value.length > 0)
          .cascade('Stop')
          .minLength(3);
      });
      const validatorTwo = createValidator<Person>({ validatorLevelCascadeMode: 'Continue', ruleLevelCascadeMode: 'Stop' }, val => {
        val
          .ruleFor('name')
          .must(value => value.length > 0)
          .minLength(3);
      });

      const person = createPersonWith({ name: '' });

      const result = validator.validate(person);
      expect(result.isValid).toBe(false);
      expect(result.failures.length).toBe(1);
      const resultTwo = validatorTwo.validate(person);
      expect(resultTwo.isValid).toBe(false);
      expect(resultTwo.failures.length).toBe(1);
    });
  });

  describe('predefined rules', () => {
    function createBaseValidator<T extends Person>() {
      return createValidator<T>(val => val.ruleFor(p => p.name).notEmpty());
    }
    it('should validate value with predefined rule', () => {
      const employee = createEmployeeWith({ name: '', department: '' });

      const employeeValidator = createBaseValidator<Employee>();
      employeeValidator.ruleFor(p => p.department).notEmpty();

      const result = employeeValidator.validate(employee);

      expect(result.isValid).toBeFalsy();
      expect(result.failures.length).toBe(2);
      expect(result.failures[0].propertyName).toBe('name');
      expect(result.failures[1].propertyName).toBe('department');
    });
  });
});
