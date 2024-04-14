import { PropertyValidator } from '../property-validator';
import { Person } from '../testing/test-models';
import { AbstractRuleBuilder } from './rule-builder';

describe(AbstractRuleBuilder.name, () => {
  let personNameValidator: PropertyValidator<Person, string>;
  let ruleBuilder: AbstractRuleBuilder<Person, string>;

  beforeEach(() => {
    personNameValidator = new PropertyValidator<Person, string>('name');
    ruleBuilder = new AbstractRuleBuilder(personNameValidator);
  });

  describe('creation', () => {
    it('should create an instance', () => {
      const ruleBuilder = new AbstractRuleBuilder(personNameValidator);

      expect(ruleBuilder).toBeDefined();
    });
  });

  describe('conditions', () => {
    describe('when', () => {
      it('should add condition to all rules', () => {
        ruleBuilder
          .build()
          .notEmpty()
          .minLength(5)
          .when(p => p.age > 18);
        expect(personNameValidator.propertyRules.every(r => r.processWhen !== null)).toBeTruthy();
      });

      it('should add condition to current rule', () => {
        ruleBuilder
          .build()
          .notEmpty()
          .minLength(5)
          .when(p => p.age > 18, 'CurrentValidator');
        expect(personNameValidator.propertyRules[0].processWhen).toBeNull();
        expect(personNameValidator.propertyRules[1].processWhen).not.toBeNull();
      });
    });

    describe('unless', () => {
      it('should add condition to all rules', () => {
        ruleBuilder
          .build()
          .notEmpty()
          .minLength(5)
          .unless(p => p.age > 18);
        expect(personNameValidator.propertyRules.every(r => r.processUnless !== null)).toBeTruthy();
      });

      it('should add condition to current rule', () => {
        ruleBuilder
          .build()
          .notEmpty()
          .minLength(5)
          .unless(p => p.age > 18, 'CurrentValidator');
        expect(personNameValidator.propertyRules[0].processUnless).toBeNull();
        expect(personNameValidator.propertyRules[1].processUnless).not.toBeNull();
      });
    });
  });
});
