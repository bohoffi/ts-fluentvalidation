import { createAsyncValidation, createValidation } from './create-validation-fn';

describe(createValidation.name, () => {
  interface TestModel {
    shouldValidate: boolean;
    shouldNotValidate: boolean;
  }

  describe('basic', () => {
    it('should create a validation function that returns true for valid values', () => {
      const isNonEmptyString = createValidation<string>(value => value.length > 0);
      expect(isNonEmptyString('valid')).toBe(true);
    });

    it('should create a validation function that returns false for invalid values', () => {
      const isNonEmptyString = createValidation<string>(value => value.length > 0);
      expect(isNonEmptyString('')).toBe(false);
    });

    it('should create a validation function with a message', () => {
      const isNonEmptyString = createValidation<string>(value => value.length > 0, 'Value must not be empty');
      expect(isNonEmptyString.message).toBe('Value must not be empty');
    });
  });

  describe('when', () => {
    it('should create a validation function with when condition', () => {
      const isNonEmptyString = createValidation<string, TestModel>(value => value.length > 0);
      const conditionalValidation = isNonEmptyString.when(model => model.shouldValidate);
      expect(conditionalValidation.metadata.when).toBeDefined();
    });

    it('should create a validation function with when condition and whenApplyTo', () => {
      const isNonEmptyString = createValidation<string, TestModel>(value => value.length > 0);
      const conditionalValidation = isNonEmptyString.when(model => model.shouldValidate, 'AllValidators');
      expect(conditionalValidation.metadata.when).toBeDefined();
      expect(conditionalValidation.metadata.whenApplyTo).toBe('AllValidators');
    });
  });

  describe('unless', () => {
    it('should create a validation function with unless condition', () => {
      const isNonEmptyString = createValidation<string, TestModel>(value => value.length > 0);
      const conditionalValidation = isNonEmptyString.unless(model => model.shouldNotValidate);
      expect(conditionalValidation.metadata.unless).toBeDefined();
    });

    it('should create a validation function with unless condition and unlessApplyTo', () => {
      const isNonEmptyString = createValidation<string, TestModel>(value => value.length > 0);
      const conditionalValidation = isNonEmptyString.unless(model => model.shouldNotValidate, 'AllValidators');
      expect(conditionalValidation.metadata.unless).toBeDefined();
      expect(conditionalValidation.metadata.unlessApplyTo).toBe('AllValidators');
    });
  });

  describe('withMessage', () => {
    it('should create a validation function with a message', () => {
      const isNonEmptyString = createValidation<string>(value => value.length > 0, 'FOO BAR');
      const validationWithMessage = isNonEmptyString.withMessage('Value must not be empty');
      expect(validationWithMessage.message).toBe('Value must not be empty');
    });
  });
});

describe(createAsyncValidation.name, () => {
  interface TestModel {
    shouldValidate: boolean;
    shouldNotValidate: boolean;
  }

  describe('basic', () => {
    it('should create a validation function that returns true for valid values', async () => {
      const isNonEmptyString = createAsyncValidation<string>(value => Promise.resolve(value.length > 0));
      expect(await isNonEmptyString('valid')).toBe(true);
    });

    it('should create a validation function that returns false for invalid values', async () => {
      const isNonEmptyString = createAsyncValidation<string>(value => Promise.resolve(value.length > 0));
      expect(await isNonEmptyString('')).toBe(false);
    });

    it('should create a validation function with a message', () => {
      const isNonEmptyString = createAsyncValidation<string>(value => Promise.resolve(value.length > 0), 'Value must not be empty');
      expect(isNonEmptyString.message).toBe('Value must not be empty');
    });
  });

  describe('when', () => {
    it('should create a validation function with when condition', () => {
      const isNonEmptyString = createAsyncValidation<string, TestModel>(value => Promise.resolve(value.length > 0));
      const conditionalValidation = isNonEmptyString.when(model => model.shouldValidate);
      expect(conditionalValidation.metadata.when).toBeDefined();
    });

    it('should create a validation function with when condition and whenApplyTo', () => {
      const isNonEmptyString = createAsyncValidation<string, TestModel>(value => Promise.resolve(value.length > 0));
      const conditionalValidation = isNonEmptyString.when(model => model.shouldValidate, 'AllValidators');
      expect(conditionalValidation.metadata.when).toBeDefined();
      expect(conditionalValidation.metadata.whenApplyTo).toBe('AllValidators');
    });
  });

  describe('unless', () => {
    it('should create a validation function with unless condition', () => {
      const isNonEmptyString = createAsyncValidation<string, TestModel>(value => Promise.resolve(value.length > 0));
      const conditionalValidation = isNonEmptyString.unless(model => model.shouldNotValidate);
      expect(conditionalValidation.metadata.unless).toBeDefined();
    });

    it('should create a validation function with unless condition and unlessApplyTo', () => {
      const isNonEmptyString = createAsyncValidation<string, TestModel>(value => Promise.resolve(value.length > 0));
      const conditionalValidation = isNonEmptyString.unless(model => model.shouldNotValidate, 'AllValidators');
      expect(conditionalValidation.metadata.unless).toBeDefined();
      expect(conditionalValidation.metadata.unlessApplyTo).toBe('AllValidators');
    });
  });

  describe('withMessage', () => {
    it('should create a validation function with a message', () => {
      const isNonEmptyString = createAsyncValidation<string>(value => Promise.resolve(value.length > 0), 'FOO BAR');
      const validationWithMessage = isNonEmptyString.withMessage('Value must not be empty');
      expect(validationWithMessage.message).toBe('Value must not be empty');
    });
  });
});
