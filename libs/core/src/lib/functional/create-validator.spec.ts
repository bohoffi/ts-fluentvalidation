import { createPersonWith } from '../testing/test-data';
import { Person } from '../testing/test-models';
import { createValidator } from './create-validator';
import { equals, isTrue, matches, maxLength, minLength, notEquals } from './validations';

describe(createValidator.name, () => {
  describe('validate should return result', () => {
    it('should validate object and return result', () => {
      const val = createValidator<Person>().ruleFor('name', minLength(1));

      const result = val.validate(createPersonWith({ name: '' }));
      expect(result.isValid).toBe(false);
      expect(result.failures).toEqual([{ propertyName: 'name', message: 'Value must have a minimum length of 1', attemptedValue: '' }]);
    });

    it('should validate multiple rules and return result', () => {
      const val = createValidator<Person>()
        .ruleFor('name', minLength(6))
        .ruleFor('age', notEquals<number, Person>(0))
        .ruleFor('registred', isTrue());

      const result = val.validate(createPersonWith({ name: 'world', age: 0, registred: false }));
      expect(result.isValid).toBe(false);
      expect(result.failures).toEqual([
        { propertyName: 'name', message: 'Value must have a minimum length of 6', attemptedValue: 'world' },
        { propertyName: 'age', message: 'Value must not equal 0', attemptedValue: 0 },
        { propertyName: 'registred', message: 'Value must be true', attemptedValue: false }
      ]);
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

        let result = val.validate(
          createPersonWith({
            name: '',
            age: 5
          })
        );
        expect(result.isValid).toBe(false);
        expect(result.failures.find(failure => failure.propertyName === 'name')).toBeDefined();
        expect(result.failures.find(failure => failure.propertyName === 'age')).toBeUndefined();

        val = createValidator<Person>({ includeProperties: ['name', 'age'] })
          .ruleFor('name', minLength(1))
          .ruleFor('age', equals<number, Person>(3));

        result = val.validate(
          createPersonWith({
            name: '',
            age: 5
          })
        );
        expect(result.isValid).toBe(false);
        expect(result.failures.find(failure => failure.propertyName === 'name')).toBeDefined();
        expect(result.failures.find(failure => failure.propertyName === 'age')).toBeDefined();
      });
    });

    describe('cascadeMode', () => {
      it('should stop validation on first failure', () => {
        const val = createValidator<Person>({ cascadeMode: 'Stop' })
          .ruleFor('name', minLength(6))
          .ruleFor('age', notEquals<number, Person>(0))
          .ruleFor('registred', isTrue());

        const result = val.validate(createPersonWith({ name: 'world', age: 0, registred: false }));
        expect(result.isValid).toBe(false);
        expect(result.failures).toEqual([
          { propertyName: 'name', message: 'Value must have a minimum length of 6', attemptedValue: 'world' }
        ]);
      });

      it('should continue validation on failure', () => {
        const val = createValidator<Person>({ cascadeMode: 'Continue' })
          .ruleFor('name', minLength(6))
          .ruleFor('age', notEquals<number, Person>(0))
          .ruleFor('registred', isTrue());

        const result = val.validate(createPersonWith({ name: 'world', age: 0, registred: false }));
        expect(result.isValid).toBe(false);
        expect(result.failures).toEqual([
          { propertyName: 'name', message: 'Value must have a minimum length of 6', attemptedValue: 'world' },
          { propertyName: 'age', message: 'Value must not equal 0', attemptedValue: 0 },
          { propertyName: 'registred', message: 'Value must be true', attemptedValue: false }
        ]);
      });
    });
  });

  describe('rule conditions', () => {
    it('should not run validation when when condition is false', () => {
      const failingValidationFn = equals<number, Person>(3).when(model => model.age > 30);

      const val = createValidator<Person>().ruleFor('age', failingValidationFn);

      const result = val.validate(createPersonWith({ age: 3 }));
      expect(result.isValid).toBe(true);
    });

    it('should run validation when when condition is true', () => {
      const failingValidationFn = equals<number, Person>(3).when(model => model.age > 30);

      const val = createValidator<Person>().ruleFor('age', failingValidationFn);

      const result = val.validate(createPersonWith({ age: 31 }));
      expect(result.isValid).toBe(false);
      expect(result.failures).toEqual([{ propertyName: 'age', message: 'Value must equal 3', attemptedValue: 31 }]);
    });

    it('should run unless validation when unless condition is false', () => {
      const failingValidationFn = equals<number, Person>(3).unless(model => model.age > 30);

      const val = createValidator<Person>().ruleFor('age', failingValidationFn);

      const result = val.validate(createPersonWith({ age: 31 }));
      expect(result.isValid).toBe(true);
    });

    it('should not run unless validation when unless condition is true', () => {
      const failingValidationFn = equals<number, Person>(3).unless(model => model.age > 30);

      const val = createValidator<Person>().ruleFor('age', failingValidationFn);

      const result = val.validate(createPersonWith({ age: 4 }));
      expect(result.isValid).toBe(false);
      expect(result.failures).toEqual([{ propertyName: 'age', message: 'Value must equal 3', attemptedValue: 4 }]);
    });

    describe('ApplyConditionTo', () => {
      it('should apply condition to all validators', () => {
        const val = createValidator<Person>().ruleFor(
          'name',
          maxLength(6),
          matches<Person>(/hello/).when(model => model.age > 30)
        );

        const result = val.validate(createPersonWith({ name: 'John Doe', age: 31 }));
        expect(result.isValid).toBe(false);
        expect(result.failures).toEqual([
          { propertyName: 'name', message: 'Value must have a maximum length of 6', attemptedValue: 'John Doe' },
          { propertyName: 'name', message: 'Value must match pattern', attemptedValue: 'John Doe' }
        ]);
      });

      it('should apply condition to current validator only', () => {
        const val = createValidator<Person>().ruleFor(
          'name',
          maxLength(6),
          matches<Person>(/hello/).when(model => model.age > 35, 'CurrentValidator')
        );

        const result = val.validate(createPersonWith({ name: 'John Doe', age: 31 }));
        expect(result.isValid).toBe(false);
        expect(result.failures).toEqual([
          { propertyName: 'name', message: 'Value must have a maximum length of 6', attemptedValue: 'John Doe' }
        ]);
      });
    });
  });

  describe('rule cascading', () => {
    it('should stop validation on first failure', () => {
      const val = createValidator<Person>().ruleFor('name', 'Stop', minLength(6), equals<string, Person>('hello'));

      const result = val.validate(createPersonWith({ name: 'world' }));
      expect(result.isValid).toBe(false);
      expect(result.failures).toEqual([
        { propertyName: 'name', message: 'Value must have a minimum length of 6', attemptedValue: 'world' }
      ]);
    });

    it('should continue validation on failure', () => {
      const val = createValidator<Person>().ruleFor('name', minLength(6), equals<string, Person>('hello'));

      const result = val.validate(createPersonWith({ name: 'world' }));
      expect(result.isValid).toBe(false);
      expect(result.failures).toEqual([
        { propertyName: 'name', message: 'Value must have a minimum length of 6', attemptedValue: 'world' },
        { propertyName: 'name', message: 'Value must equal hello', attemptedValue: 'world' }
      ]);
    });
  });
});
