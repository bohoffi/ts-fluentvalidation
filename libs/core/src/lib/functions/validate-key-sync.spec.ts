import { ValidationError } from '../errors/validation-error';
import { createValidationContext, ValidationContext } from '../validation-context';
import { minLength, must, notEmpty } from '../validations';
import { validateKeySync } from './validate-key-sync';

describe(validateKeySync.name, () => {
  interface TestModel {
    name: string;
    age: number;
  }

  const model: TestModel = {
    name: 'John Doe',
    age: 30
  };

  let validationContext: ValidationContext<TestModel>;

  const notEmptyValidationFn = notEmpty<string, TestModel>('Name cannot be empty');
  const minLengthValidationFn = minLength<string, TestModel>(11, 'Name must be longer than 10 characters');
  const mustIncludeDoeValidationFn = must<string, TestModel>(value => value.includes('Doe'), 'Name must include Doe');
  const mustIncludeJaneValidationFn = must<string, TestModel>(value => value.includes('Jane'), 'Name must include Jane');

  beforeEach(() => {
    validationContext = createValidationContext(model);
  });

  describe('validate', () => {
    it('should return no failures when all validations pass', () => {
      validateKeySync(validationContext, 'name', [notEmptyValidationFn], 'Continue');
      expect(validationContext.failures).toEqual([]);
    });

    it('should return a failure when a validation fails', () => {
      validateKeySync(validationContext, 'name', [minLengthValidationFn], 'Continue');
      expect(validationContext.failures).toEqual([
        {
          propertyName: 'name',
          message: 'Name must be longer than 10 characters',
          errorCode: 'minLength',
          attemptedValue: 'John Doe',
          severity: 'Error'
        }
      ]);
    });
  });

  describe('throwOnFailures', () => {
    it('should throw a ValidationError when throwOnFailures is true', () => {
      expect(() => validateKeySync(validationContext, 'name', [minLengthValidationFn], 'Continue', true)).toThrow(ValidationError);
    });
  });

  describe('cascade mode', () => {
    it('should stop validation on first failure when cascade mode is Stop', () => {
      validateKeySync(validationContext, 'name', [minLengthValidationFn, mustIncludeDoeValidationFn], 'Stop');
      expect(validationContext.failures).toEqual([
        {
          propertyName: 'name',
          message: 'Name must be longer than 10 characters',
          errorCode: 'minLength',
          attemptedValue: 'John Doe',
          severity: 'Error'
        }
      ]);
    });

    it('should continue validation on failure when cascade mode is Continue', () => {
      validateKeySync(validationContext, 'name', [minLengthValidationFn, mustIncludeJaneValidationFn], 'Continue');
      expect(validationContext.failures).toEqual([
        {
          propertyName: 'name',
          message: 'Name must be longer than 10 characters',
          errorCode: 'minLength',
          attemptedValue: 'John Doe',
          severity: 'Error'
        },
        {
          propertyName: 'name',
          message: 'Name must include Jane',
          errorCode: 'must',
          attemptedValue: 'John Doe',
          severity: 'Error'
        }
      ]);
    });
  });

  describe('conditions', () => {
    it('should not run validation when when condition is false', () => {
      const failingValidationFn = mustIncludeDoeValidationFn.when<TestModel>(model => model.age > 30);

      validateKeySync(validationContext, 'name', [failingValidationFn], 'Continue');
      expect(validationContext.failures).toEqual([]);
    });

    it('should not run validation when unless condition is true', () => {
      const failingValidationFn = mustIncludeDoeValidationFn.unless<TestModel>(model => model.age > 30);

      validateKeySync(validationContext, 'name', [failingValidationFn], 'Continue');
      expect(validationContext.failures).toEqual([]);
    });
  });
});
