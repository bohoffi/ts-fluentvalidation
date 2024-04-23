import { ValidationContext } from './validation-context';
import { PropertyValidator } from './property-validator';
import { NotNullRule } from './rules/common';
import { Person } from './testing/test-models';
import { createPersonWith } from './testing/test-data';
import { MaxLengthRule, MinLengthRule } from './rules/length';
import { ValidationFailure } from './result';

describe('PropertyValidator', () => {
  let propertyValidator: PropertyValidator<Person, string>;

  beforeEach(() => {
    propertyValidator = new PropertyValidator<Person, string>('name');
  });

  describe('addRule + validation', () => {
    it('should add a rule', () => {
      const rule = new NotNullRule<Person, string>();

      propertyValidator.addRule(rule);

      expect(propertyValidator.propertyRules).toContain(rule);
    });

    it('should validate value', () => {
      const person = createPersonWith({ name: 'John' });
      const validationContext = new ValidationContext<Person>(person);

      const rule1 = new NotNullRule<Person, string>();
      const rule2 = new MinLengthRule<Person, string>(5);

      propertyValidator.addRule(rule1);
      propertyValidator.addRule(rule2);

      propertyValidator.validateProperty(person.name, validationContext);

      expect(validationContext.failues).toHaveLength(1);
      expect(validationContext.failues[0]).toEqual<ValidationFailure>({
        propertyName: 'name',
        message: 'name must have a minimum length of 5.',
        attemptedValue: person.name,
        severity: 'Error',
        errorCode: MinLengthRule.name
      });
    });
  });

  describe('cascading', () => {
    it('should validate value with cascade stop', () => {
      const person = createPersonWith({ name: 'John' });
      const validationContext = new ValidationContext<Person>(person);

      const rule1 = new MinLengthRule<Person, string>(5);
      const rule2 = new MaxLengthRule<Person, string>(3);

      propertyValidator.addRule(rule1);
      propertyValidator.addRule(rule2);

      propertyValidator.cascade('Stop');

      propertyValidator.validateProperty(person.name, validationContext);

      expect(validationContext.failues).toHaveLength(1);
      expect(validationContext.failues[0]).toEqual<ValidationFailure>({
        propertyName: 'name',
        message: 'name must have a minimum length of 5.',
        attemptedValue: person.name,
        severity: 'Error',
        errorCode: MinLengthRule.name
      });
    });

    it('should validate value with cascade continue', () => {
      const person = createPersonWith({ name: 'John' });
      const validationContext = new ValidationContext<Person>(person);

      const rule1 = new MinLengthRule<Person, string>(5);
      const rule2 = new MaxLengthRule<Person, string>(3);

      propertyValidator.addRule(rule1);
      propertyValidator.addRule(rule2);

      propertyValidator.cascade('Continue');

      propertyValidator.validateProperty(person.name, validationContext);

      expect(validationContext.failues).toHaveLength(2);
      expect(validationContext.failues[0]).toEqual<ValidationFailure>({
        propertyName: 'name',
        message: 'name must have a minimum length of 5.',
        attemptedValue: person.name,
        severity: 'Error',
        errorCode: MinLengthRule.name
      });
      expect(validationContext.failues[1]).toEqual<ValidationFailure>({
        propertyName: 'name',
        message: 'name must have a maximum length of 3.',
        attemptedValue: person.name,
        severity: 'Error',
        errorCode: MaxLengthRule.name
      });
    });
  });

  describe('conditions', () => {
    it('should validate value with processWhen', () => {
      const person = createPersonWith({ name: 'John' });
      const validationContext = new ValidationContext<Person>(person);

      const rule1 = new MinLengthRule<Person, string>(5);
      const rule2 = new MaxLengthRule<Person, string>(3);

      rule2.withWhenCondition(() => false);

      propertyValidator.addRule(rule1);
      propertyValidator.addRule(rule2);

      propertyValidator.validateProperty(person.name, validationContext);

      expect(validationContext.failues).toHaveLength(1);
      expect(validationContext.failues[0]).toEqual<ValidationFailure>({
        propertyName: 'name',
        message: 'name must have a minimum length of 5.',
        attemptedValue: person.name,
        severity: 'Error',
        errorCode: MinLengthRule.name
      });
    });

    it('should validate value with processUnless', () => {
      const person = createPersonWith({ name: 'John' });
      const validationContext = new ValidationContext<Person>(person);

      const rule1 = new MinLengthRule<Person, string>(5);
      const rule2 = new MaxLengthRule<Person, string>(3);

      rule2.withUnlessCondition(() => true);

      propertyValidator.addRule(rule1);
      propertyValidator.addRule(rule2);

      propertyValidator.validateProperty(person.name, validationContext);

      expect(validationContext.failues).toHaveLength(1);
      expect(validationContext.failues[0]).toEqual<ValidationFailure>({
        propertyName: 'name',
        message: 'name must have a minimum length of 5.',
        attemptedValue: person.name,
        severity: 'Error',
        errorCode: MinLengthRule.name
      });
    });
  });

  describe('extended', () => {
    it('should validate value with extended message', () => {
      const person = createPersonWith({ name: 'John' });
      const validationContext = new ValidationContext<Person>(person);

      const rule = new MinLengthRule<Person, string>(5);

      rule.withMessage('Custom message');

      propertyValidator.addRule(rule);

      propertyValidator.validateProperty(person.name, validationContext);

      expect(validationContext.failues).toHaveLength(1);
      expect(validationContext.failues[0]).toEqual<ValidationFailure>({
        propertyName: 'name',
        message: 'Custom message',
        attemptedValue: person.name,
        severity: 'Error',
        errorCode: MinLengthRule.name
      });
    });

    it('should validate value with extended name', () => {
      const person = createPersonWith({ name: 'John' });
      const validationContext = new ValidationContext<Person>(person);

      const rule = new MinLengthRule<Person, string>(5);

      rule.withName('Custom name');

      propertyValidator.addRule(rule);

      propertyValidator.validateProperty(person.name, validationContext);

      expect(validationContext.failues).toHaveLength(1);
      expect(validationContext.failues[0]).toEqual<ValidationFailure>({
        propertyName: 'name',
        message: 'Custom name must have a minimum length of 5.',
        attemptedValue: person.name,
        severity: 'Error',
        errorCode: MinLengthRule.name
      });
    });

    it('should validate value with updated severity', () => {
      const person = createPersonWith({ name: 'John' });
      const validationContext = new ValidationContext<Person>(person);

      const rule = new MinLengthRule<Person, string>(5);

      rule.withName('Custom name').withSeverity(() => 'Warning');

      propertyValidator.addRule(rule);

      propertyValidator.validateProperty(person.name, validationContext);

      expect(validationContext.failues).toHaveLength(1);
      expect(validationContext.failues[0]).toEqual<ValidationFailure>({
        propertyName: 'name',
        message: 'Custom name must have a minimum length of 5.',
        attemptedValue: person.name,
        severity: 'Warning',
        errorCode: MinLengthRule.name
      });
    });

    it('should validate value with updated error code', () => {
      const person = createPersonWith({ name: 'John' });
      const validationContext = new ValidationContext<Person>(person);

      const rule = new MinLengthRule<Person, string>(5);

      rule.withName('Custom name').withErrorCode('ERR1234');

      propertyValidator.addRule(rule);

      propertyValidator.validateProperty(person.name, validationContext);

      expect(validationContext.failues).toHaveLength(1);
      expect(validationContext.failues[0]).toEqual<ValidationFailure>({
        propertyName: 'name',
        message: 'Custom name must have a minimum length of 5.',
        attemptedValue: person.name,
        severity: 'Error',
        errorCode: 'ERR1234'
      });
    });
  });
});
