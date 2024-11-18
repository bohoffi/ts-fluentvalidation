import { ValidationError } from '../errors/validation-error';
import { createValidationContext, ValidationContext } from '../validation-context';
import { minLength, must, notEmpty } from '../validations';
import { validateKeyAsync } from './validate-key-async';

describe(validateKeyAsync.name, () => {
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
    it('should return no failures when all validations pass', async () => {
      await validateKeyAsync(validationContext, 'name', [notEmptyValidationFn], 'Continue');
      expect(validationContext.failures).toEqual([]);
    });

    it('should return a failure when a validation fails', async () => {
      await validateKeyAsync(validationContext, 'name', [minLengthValidationFn], 'Continue');
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
    it('should throw a ValidationError when throwOnFailures is true', async () => {
      await expect(
        async () => await validateKeyAsync(validationContext, 'name', [minLengthValidationFn], 'Continue', true)
      ).rejects.toThrow(ValidationError);
    });
  });

  describe('cascade mode', () => {
    it('should stop validation on first failure when cascade mode is Stop', async () => {
      await validateKeyAsync(validationContext, 'name', [minLengthValidationFn, mustIncludeDoeValidationFn], 'Stop');
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

    it('should continue validation on failure when cascade mode is Continue', async () => {
      await validateKeyAsync(validationContext, 'name', [minLengthValidationFn, mustIncludeJaneValidationFn], 'Continue');
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
    it('should not run validation when when condition is false', async () => {
      const failingValidationFn = mustIncludeDoeValidationFn.when<TestModel>(model => model.age > 30);

      await validateKeyAsync(validationContext, 'name', [failingValidationFn], 'Continue');
      expect(validationContext.failures).toEqual([]);
    });

    it('should not run validation when whenAsync condition is false', async () => {
      const failingValidationFn = mustIncludeDoeValidationFn.whenAsync<TestModel>(model => Promise.resolve(model.age > 30));

      await validateKeyAsync(validationContext, 'name', [failingValidationFn], 'Continue');
      expect(validationContext.failures).toEqual([]);
    });

    it('should not run validation when unless condition is true', async () => {
      const failingValidationFn = mustIncludeDoeValidationFn.unless<TestModel>(model => model.age > 29);

      await validateKeyAsync(validationContext, 'name', [failingValidationFn], 'Continue');
      expect(validationContext.failures).toEqual([]);
    });

    it('should not run validation when unlessAsync condition is true', async () => {
      const failingValidationFn = mustIncludeDoeValidationFn.unlessAsync<TestModel>(model => Promise.resolve(model.age > 29));

      await validateKeyAsync(validationContext, 'name', [failingValidationFn], 'Continue');
      expect(validationContext.failures).toEqual([]);
    });
  });
});
