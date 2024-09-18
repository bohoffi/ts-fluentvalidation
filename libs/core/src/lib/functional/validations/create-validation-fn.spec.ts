import { createValidationFn } from './create-validation-fn';

describe(createValidationFn.name, () => {
  interface TestModel {
    shouldValidate: boolean;
    shouldNotValidate: boolean;
  }

  describe('basic', () => {
    it('should create a validation function that returns true for valid values', () => {
      const isNonEmptyString = createValidationFn<string>(value => value.length > 0);
      expect(isNonEmptyString('valid')).toBe(true);
    });

    it('should create a validation function that returns false for invalid values', () => {
      const isNonEmptyString = createValidationFn<string>(value => value.length > 0);
      expect(isNonEmptyString('')).toBe(false);
    });

    it('should create a validation function with a message', () => {
      const isNonEmptyString = createValidationFn<string>(value => value.length > 0, 'Value must not be empty');
      expect(isNonEmptyString.message).toBe('Value must not be empty');
    });
  });

  describe('when', () => {
    it('should create a validation function with when condition', () => {
      const isNonEmptyString = createValidationFn<string, TestModel>(value => value.length > 0);
      const conditionalValidation = isNonEmptyString.when(model => model.shouldValidate);
      expect(conditionalValidation.metadata.when).toBeDefined();
    });

    it('should create a validation function with when condition and whenApplyTo', () => {
      const isNonEmptyString = createValidationFn<string, TestModel>(value => value.length > 0);
      const conditionalValidation = isNonEmptyString.when(model => model.shouldValidate, 'AllValidators');
      expect(conditionalValidation.metadata.when).toBeDefined();
      expect(conditionalValidation.metadata.whenApplyTo).toBe('AllValidators');
    });
  });

  describe('unless', () => {
    it('should create a validation function with unless condition', () => {
      const isNonEmptyString = createValidationFn<string, TestModel>(value => value.length > 0);
      const conditionalValidation = isNonEmptyString.unless(model => model.shouldNotValidate);
      expect(conditionalValidation.metadata.unless).toBeDefined();
    });

    it('should create a validation function with unless condition and unlessApplyTo', () => {
      const isNonEmptyString = createValidationFn<string, TestModel>(value => value.length > 0);
      const conditionalValidation = isNonEmptyString.unless(model => model.shouldNotValidate, 'AllValidators');
      expect(conditionalValidation.metadata.unless).toBeDefined();
      expect(conditionalValidation.metadata.unlessApplyTo).toBe('AllValidators');
    });
  });

  describe('withMessage', () => {
    it('should create a validation function with a message', () => {
      const isNonEmptyString = createValidationFn<string>(value => value.length > 0, 'FOO BAR');
      const validationWithMessage = isNonEmptyString.withMessage('Value must not be empty');
      expect(validationWithMessage.message).toBe('Value must not be empty');
    });
  });
});
