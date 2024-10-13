import { createValidator } from '../lib/create-validator';
import { matches, notEmpty } from '../lib/validations';
import { testValidate, testValidateAsync } from '../testing/src/test-validate';
import {
  expectFailureLength,
  expectResultInvalid,
  expectResultValid,
  expectValidationsMetadataToBe,
  expectValidationsMetadataToBeDefined,
  expectValidationsMetadataToBeUndefined
} from './assertions';
import { Person, createPersonWith } from './fixtures';

describe('conditions', () => {
  describe('synchronous', () => {
    describe('validation.when()', () => {
      it('should set metadata', () => {
        const validator = createValidator<Person>().ruleFor(
          'lastName',
          notEmpty().when(p => p.age >= 18)
        );

        expectValidationsMetadataToBeDefined(validator, 'lastName', 0, 'when');
        expectValidationsMetadataToBe(validator, 'lastName', 0, 'whenApplyTo', 'AllValidators');
      });

      it('should run validation when condition is true', () => {
        const validator = createValidator<Person>().ruleFor(
          'lastName',
          notEmpty().when(p => p.age >= 18)
        );

        const result = testValidate(validator, createPersonWith({ lastName: '', age: 18 }));
        expectResultInvalid(result);
        expectFailureLength(result, 1);
        result.shouldHaveValidationErrorFor('lastName');
      });

      it('should not run validation when condition is false', () => {
        const validator = createValidator<Person>().ruleFor(
          'lastName',
          notEmpty().when(p => p.age >= 18)
        );

        const result = validator.validate(createPersonWith({ lastName: '', age: 17 }));
        expectResultValid(result);
      });
    });

    describe('validation.unless()', () => {
      it('should set metadata', () => {
        const validator = createValidator<Person>().ruleFor(
          'lastName',
          notEmpty().unless(p => p.age >= 18)
        );

        expectValidationsMetadataToBeDefined(validator, 'lastName', 0, 'unless');
        expectValidationsMetadataToBe(validator, 'lastName', 0, 'unlessApplyTo', 'AllValidators');
      });

      it('should run validation when condition is false', () => {
        const validator = createValidator<Person>().ruleFor(
          'lastName',
          notEmpty().unless(p => p.age < 18)
        );

        const result = testValidate(validator, createPersonWith({ lastName: '', age: 18 }));
        expectResultInvalid(result);
        expectFailureLength(result, 1);
        result.shouldHaveValidationErrorFor('lastName');
      });

      it('should not run validation when condition is true', () => {
        const validator = createValidator<Person>().ruleFor(
          'lastName',
          notEmpty().unless(p => p.age < 18)
        );

        const result = validator.validate(createPersonWith({ lastName: '', age: 17 }));
        expectResultValid(result);
      });
    });
  });

  describe('asynchronous', () => {
    describe('validation.whenAsync()', () => {
      it('should set metadata', () => {
        const validator = createValidator<Person>().ruleFor(
          'lastName',
          notEmpty().whenAsync(p => Promise.resolve(p.age >= 18))
        );

        expectValidationsMetadataToBeDefined(validator, 'lastName', 0, 'whenAsync');
        expectValidationsMetadataToBe(validator, 'lastName', 0, 'whenApplyTo', 'AllValidators');
      });

      it('should run validation when condition is true', async () => {
        const validator = createValidator<Person>().ruleFor(
          'lastName',
          notEmpty().whenAsync(p => Promise.resolve(p.age >= 18))
        );

        const result = await testValidateAsync(validator, createPersonWith({ lastName: '', age: 18 }));
        expectResultInvalid(result);
        expectFailureLength(result, 1);
        result.shouldHaveValidationErrorFor('lastName');
      });
      it('should not run validation when condition is false', async () => {
        const validator = createValidator<Person>().ruleFor(
          'lastName',
          notEmpty().whenAsync(p => Promise.resolve(p.age >= 18))
        );

        const result = await validator.validateAsync(createPersonWith({ lastName: '', age: 17 }));
        expectResultValid(result);
      });
    });

    describe('validation.unlessAsync()', () => {
      it('should set metadata', () => {
        const validator = createValidator<Person>().ruleFor(
          'lastName',
          notEmpty().unlessAsync(p => Promise.resolve(p.age >= 18))
        );

        expectValidationsMetadataToBeDefined(validator, 'lastName', 0, 'unlessAsync');
        expectValidationsMetadataToBe(validator, 'lastName', 0, 'unlessApplyTo', 'AllValidators');
      });
      it('should run validation when condition is false', async () => {
        const validator = createValidator<Person>().ruleFor(
          'lastName',
          notEmpty().unlessAsync(p => Promise.resolve(p.age < 18))
        );

        const result = await testValidateAsync(validator, createPersonWith({ lastName: '', age: 18 }));
        expectResultInvalid(result);
        expectFailureLength(result, 1);
        result.shouldHaveValidationErrorFor('lastName');
      });
      it('should not run validation when condition is true', async () => {
        const validator = createValidator<Person>().ruleFor(
          'lastName',
          notEmpty().unlessAsync(p => Promise.resolve(p.age < 18))
        );

        const result = await validator.validateAsync(createPersonWith({ lastName: '', age: 17 }));
        expectResultValid(result);
      });
    });
  });

  describe('ApplyConditionTo', () => {
    it('should apply to all preceeding validations', () => {
      const validator = createValidator<Person>().ruleFor(
        'lastName',
        matches(/Doe/),
        notEmpty().when(p => p.age >= 18)
      );

      expectValidationsMetadataToBeDefined(validator, 'lastName', 0, 'when');
      expectValidationsMetadataToBeDefined(validator, 'lastName', 1, 'when');
    });
    it('should apply to current validation only', () => {
      const validator = createValidator<Person>().ruleFor(
        'lastName',
        matches(/Doe/),
        notEmpty().when(p => p.age >= 18, 'CurrentValidator')
      );

      expectValidationsMetadataToBeUndefined(validator, 'lastName', 0, 'when');
      expectValidationsMetadataToBeDefined(validator, 'lastName', 1, 'when');
    });
  });
});
