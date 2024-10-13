import { createValidator } from '../lib/create-validator';
import { AsyncValidatorInvokedSynchronouslyError } from '../lib/errors/async-validator-invoked-synchronously-error';
import { ValidationError } from '../lib/errors/validation-error';
import { mustAsync, notEmpty } from '../lib/validations';
import { createPersonWith, Person } from './fixtures';

describe('errors', () => {
  describe(ValidationError.name, () => {
    const testPerson = createPersonWith({ lastName: '' });

    describe('createValidator() - config - throwOnFailures', () => {
      const validator = createValidator<Person>({
        throwOnFailures: true
      }).ruleFor('lastName', notEmpty());
      it('should not throw error when validating synchronously with throwOnFailures set to false or undefined', () => {
        const unsetValidator = createValidator<Person>().ruleFor('lastName', notEmpty());

        expect(() => unsetValidator.validate(testPerson)).not.toThrow();
      });
      it('should not throw error when validating asynchronously with throwOnFailures set to false or undefined', async () => {
        const unsetValidator = createValidator<Person>().ruleFor('lastName', notEmpty());

        expect(async () => await unsetValidator.validateAsync(testPerson)).not.toThrow();
      });
      it('should throw error when validating synchronously with throwOnFailures set to true', () => {
        expect(() => validator.validate(testPerson)).toThrow(ValidationError);
      });
      it('should throw error when validating asynchronously with throwOnFailures set to true', async () => {
        expect(async () => await validator.validateAsync(testPerson)).rejects.toThrow(ValidationError);
      });
      it('should not throw error when throwOnFailures is overwritten by validate() call', () => {
        expect(() => validator.validate(testPerson, config => (config.throwOnFailures = false))).not.toThrow();
      });
      it('should not throw error when throwOnFailures is overwritten by validateAsync() call', async () => {
        expect(async () => await validator.validateAsync(testPerson, config => (config.throwOnFailures = false))).not.toThrow();
      });
    });
    describe('validate() - config - throwOnFailures', () => {
      const validator = createValidator<Person>().ruleFor('lastName', notEmpty());
      it('should not throw error when throwOnFailures is false or undefined', () => {
        expect(() => validator.validate(testPerson)).not.toThrow();
      });
      it('should throw error when throwOnFailures is true', () => {
        expect(() => validator.validate(testPerson, config => (config.throwOnFailures = true))).toThrow(ValidationError);
      });
    });
    describe('validateAsync() - config - throwOnFailures', () => {
      const validator = createValidator<Person>().ruleFor('lastName', notEmpty());
      it('should not throw error when throwOnFailures is false or undefined', async () => {
        expect(() => validator.validate(testPerson)).not.toThrow();
      });
      it('should throw error when throwOnFailures is true', async () => {
        expect(async () => await validator.validateAsync(testPerson, config => (config.throwOnFailures = true))).rejects.toThrow(
          ValidationError
        );
      });
    });
    describe('validateAndThrow wrapper', () => {
      it('validateAndThrow()', () => {
        const validator = createValidator<Person>().ruleFor('lastName', notEmpty());

        expect(() => validator.validateAndThrow(testPerson)).toThrow(ValidationError);
      });
      it('validateAndThrowAsync()', async () => {
        const validator = createValidator<Person>().ruleFor('lastName', notEmpty());

        expect(async () => await validator.validateAndThrowAsync(testPerson)).rejects.toThrow(ValidationError);
      });
    });
  });

  describe(AsyncValidatorInvokedSynchronouslyError.name, () => {
    it('should throw error when async validation is invoked synchronously', () => {
      const validator = createValidator<Person>().ruleFor(
        'lastName',
        mustAsync(lastName => Promise.resolve(lastName.startsWith('J')))
      );

      expect(() => validator.validate(createPersonWith())).toThrow(AsyncValidatorInvokedSynchronouslyError);
    });

    it('should throw error when validation with async when condition is invoked synchronously', () => {
      const validator = createValidator<Person>().ruleFor(
        'lastName',
        notEmpty().whenAsync(p => Promise.resolve(p.age >= 18))
      );

      expect(() => validator.validate(createPersonWith())).toThrow(AsyncValidatorInvokedSynchronouslyError);
    });

    it('should throw error when validation with async unless condition is invoked synchronously', () => {
      const validator = createValidator<Person>().ruleFor(
        'lastName',
        notEmpty().unlessAsync(p => Promise.resolve(p.age >= 18))
      );

      expect(() => validator.validate(createPersonWith())).toThrow(AsyncValidatorInvokedSynchronouslyError);
    });
  });
});
