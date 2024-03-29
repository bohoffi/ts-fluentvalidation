import { ValidationContext } from './models';
import { PropertyValidator } from './property-validator';
import { IsNotNullRule } from './rules/common';
import { Person } from './testing/test-models';
import { createPersonWith } from './testing/test-data';
import { MaxLengthRule, MinLengthRule } from './rules/length';

describe('PropertyValidator', () => {
  let propertyValidator: PropertyValidator<Person, string>;

  beforeEach(() => {
    propertyValidator = new PropertyValidator<Person, string>('name');
  });

  describe('addRule + validation', () => {
    it('should add a rule', () => {
      const rule = new IsNotNullRule<Person, string>();

      propertyValidator.addRule(rule);

      expect(propertyValidator.propertyRules).toContain(rule);
    });

    it('should validate value', () => {
      const person = createPersonWith({ name: 'John' });
      const validationContext: ValidationContext<Person> = {
        candidate: person
      };

      const rule1 = new IsNotNullRule<Person, string>();
      const rule2 = new MinLengthRule<Person, string>(5);

      propertyValidator.addRule(rule1);
      propertyValidator.addRule(rule2);

      const result = propertyValidator.validate(person.name, validationContext);

      expect(result).toHaveLength(1);
      expect(result[0]).toEqual({
        propertyName: 'name',
        message: 'name must have a minimum length of 5',
        attemptedValue: person.name
      });
    });
  });

  describe('cascading', () => {
    it('should validate value with cascade stop', () => {
      const person = createPersonWith({ name: 'John' });
      const validationContext: ValidationContext<Person> = {
        candidate: person
      };

      const rule1 = new MinLengthRule<Person, string>(5);
      const rule2 = new MaxLengthRule<Person, string>(3);

      propertyValidator.addRule(rule1);
      propertyValidator.addRule(rule2);

      propertyValidator.cascade('Stop');

      const result = propertyValidator.validate(person.name, validationContext);

      expect(result).toHaveLength(1);
      expect(result[0]).toEqual({
        propertyName: 'name',
        message: 'name must have a minimum length of 5',
        attemptedValue: person.name
      });
    });

    it('should validate value with cascade continue', () => {
      const person = createPersonWith({ name: 'John' });
      const validationContext: ValidationContext<Person> = {
        candidate: person
      };

      const rule1 = new MinLengthRule<Person, string>(5);
      const rule2 = new MaxLengthRule<Person, string>(3);

      propertyValidator.addRule(rule1);
      propertyValidator.addRule(rule2);

      propertyValidator.cascade('Continue');

      const result = propertyValidator.validate(person.name, validationContext);

      expect(result).toHaveLength(2);
      expect(result[0]).toEqual({
        propertyName: 'name',
        message: 'name must have a minimum length of 5',
        attemptedValue: person.name
      });
      expect(result[1]).toEqual({
        propertyName: 'name',
        message: 'name must have a maximum length of 3',
        attemptedValue: person.name
      });
    });
  });

  describe('conditions', () => {
    it('should validate value with processWhen', () => {
      const person = createPersonWith({ name: 'John' });
      const validationContext: ValidationContext<Person> = {
        candidate: person
      };

      const rule1 = new MinLengthRule<Person, string>(5);
      const rule2 = new MaxLengthRule<Person, string>(3);

      rule2.withWhenCondition(() => false);

      propertyValidator.addRule(rule1);
      propertyValidator.addRule(rule2);

      const result = propertyValidator.validate(person.name, validationContext);

      expect(result).toHaveLength(1);
      expect(result[0]).toEqual({
        propertyName: 'name',
        message: 'name must have a minimum length of 5',
        attemptedValue: person.name
      });
    });

    it('should validate value with processUnless', () => {
      const person = createPersonWith({ name: 'John' });
      const validationContext: ValidationContext<Person> = {
        candidate: person
      };

      const rule1 = new MinLengthRule<Person, string>(5);
      const rule2 = new MaxLengthRule<Person, string>(3);

      rule2.withUnlessCondition(() => true);

      propertyValidator.addRule(rule1);
      propertyValidator.addRule(rule2);

      const result = propertyValidator.validate(person.name, validationContext);

      expect(result).toHaveLength(1);
      expect(result[0]).toEqual({
        propertyName: 'name',
        message: 'name must have a minimum length of 5',
        attemptedValue: person.name
      });
    });
  });

  describe('extended', () => {
    it('should validate value with extended message', () => {
      const person = createPersonWith({ name: 'John' });
      const validationContext: ValidationContext<Person> = {
        candidate: person
      };

      const rule = new MinLengthRule<Person, string>(5);

      rule.withMessage('Custom message');

      propertyValidator.addRule(rule);

      const result = propertyValidator.validate(person.name, validationContext);

      expect(result).toHaveLength(1);
      expect(result[0]).toEqual({
        propertyName: 'name',
        message: 'Custom message',
        attemptedValue: person.name
      });
    });

    it('should validate value with extended name', () => {
      const person = createPersonWith({ name: 'John' });
      const validationContext: ValidationContext<Person> = {
        candidate: person
      };

      const rule = new MinLengthRule<Person, string>(5);

      rule.withName('Custom name');

      propertyValidator.addRule(rule);

      const result = propertyValidator.validate(person.name, validationContext);

      expect(result).toHaveLength(1);
      expect(result[0]).toEqual({
        propertyName: 'Custom name',
        message: 'Custom name must have a minimum length of 5',
        attemptedValue: person.name
      });
    });
  });
});
