import { ValidationFailure } from '../result/validation-failure';
import { ValidatorConfig } from '../types/types';
import { KeyValidations } from '../types/validations';
import { createValidationContext, ValidationContext } from '../validation-context';
import { validateKeySync } from './validate-key-sync';
import { validateSync } from './validate-sync';

jest.mock('./validate-key-sync');

describe(validateSync.name, () => {
  const mockValidateKeySync = validateKeySync as jest.MockedFunction<typeof validateKeySync>;

  beforeEach(() => {
    jest.clearAllMocks();
  });

  interface TestModel {
    prop1: string;
    prop2: number;
  }

  const model: TestModel = {
    prop1: 'value1',
    prop2: 42
  };

  const validations: KeyValidations<TestModel>[] = [
    { key: 'prop1', validations: [], cascadeMode: 'Continue' },
    { key: 'prop2', validations: [], cascadeMode: 'Stop' }
  ];

  const validatorConfig: ValidatorConfig<TestModel> = {
    includeProperties: ['prop1', 'prop2'],
    cascadeMode: 'Continue',
    throwOnFailures: false
  };

  let validationContext: ValidationContext<TestModel>;

  beforeEach(() => {
    validationContext = createValidationContext(model);
  });

  it('should validate all properties when cascadeMode is Continue', () => {
    mockValidateKeySync.mockImplementation();

    validateSync(validationContext, validations, validatorConfig);

    expect(validationContext.failures).toEqual([]);
    expect(mockValidateKeySync).toHaveBeenCalledTimes(2);
    expect(mockValidateKeySync).toHaveBeenCalledWith(validationContext, validations[0].key, validations[0].validations, 'Continue', false);
    expect(mockValidateKeySync).toHaveBeenCalledWith(validationContext, validations[1].key, validations[1].validations, 'Stop', false);
  });

  it('should stop validation when cascadeMode is Stop and there are failures', () => {
    const failure: ValidationFailure = { propertyName: 'prop1', message: 'error', severity: 'Error' };
    mockValidateKeySync.mockImplementationOnce(context => context.addFailures(failure));

    validatorConfig.cascadeMode = 'Stop';

    validateSync(validationContext, validations, validatorConfig);

    expect(validationContext.failures).toEqual([failure]);
    expect(mockValidateKeySync).toHaveBeenCalledTimes(1);
    expect(mockValidateKeySync).toHaveBeenCalledWith(validationContext, validations[0].key, validations[0].validations, 'Continue', false);
  });

  it('should filter properties based on includeProperties', () => {
    mockValidateKeySync.mockImplementation();

    validatorConfig.includeProperties = ['prop1'];

    validateSync(validationContext, validations, validatorConfig);

    expect(validationContext.failures).toEqual([]);
    expect(mockValidateKeySync).toHaveBeenCalledTimes(1);
    expect(mockValidateKeySync).toHaveBeenCalledWith(validationContext, validations[0].key, validations[0].validations, 'Continue', false);
  });

  it('should handle empty validations dictionary', () => {
    validateSync(validationContext, [], validatorConfig);

    expect(validationContext.failures).toEqual([]);
    expect(mockValidateKeySync).not.toHaveBeenCalled();
  });
});
