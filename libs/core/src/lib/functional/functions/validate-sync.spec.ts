import { ValidationFailure } from '../result/validation-failure';
import { KeyOf } from '../types/ts-helpers';
import { CascadeMode, ValidateConfig, ValidationsDictionary } from '../types/types';
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

  const validations: ValidationsDictionary<TestModel> = {
    prop1: [],
    prop2: []
  };

  const validatorConfig: ValidateConfig<TestModel> = {
    includeProperties: ['prop1', 'prop2'],
    cascadeMode: 'Continue',
    throwOnFailures: false
  };

  const keyCascadeModes: Record<KeyOf<TestModel>, CascadeMode> = {
    prop1: 'Continue',
    prop2: 'Stop'
  };

  it('should validate all properties when cascadeMode is Continue', () => {
    mockValidateKeySync.mockReturnValue([]);

    const result = validateSync(model, validations, validatorConfig, keyCascadeModes);

    expect(result).toEqual([]);
    expect(mockValidateKeySync).toHaveBeenCalledTimes(2);
    expect(mockValidateKeySync).toHaveBeenCalledWith(model, 'prop1', validations['prop1'], 'Continue', false);
    expect(mockValidateKeySync).toHaveBeenCalledWith(model, 'prop2', validations['prop2'], 'Stop', false);
  });

  it('should stop validation when cascadeMode is Stop and there are failures', () => {
    const failure: ValidationFailure = { propertyName: 'prop1', message: 'error' };
    mockValidateKeySync.mockReturnValueOnce([failure]);

    validatorConfig.cascadeMode = 'Stop';

    const result = validateSync(model, validations, validatorConfig, keyCascadeModes);

    expect(result).toEqual([failure]);
    expect(mockValidateKeySync).toHaveBeenCalledTimes(1);
    expect(mockValidateKeySync).toHaveBeenCalledWith(model, 'prop1', validations['prop1'], 'Continue', false);
  });

  it('should filter properties based on includeProperties', () => {
    mockValidateKeySync.mockReturnValue([]);

    validatorConfig.includeProperties = ['prop1'];

    const result = validateSync(model, validations, validatorConfig, keyCascadeModes);

    expect(result).toEqual([]);
    expect(mockValidateKeySync).toHaveBeenCalledTimes(1);
    expect(mockValidateKeySync).toHaveBeenCalledWith(model, 'prop1', validations['prop1'], 'Continue', false);
  });

  it('should handle empty validations dictionary', () => {
    const result = validateSync(model, {}, validatorConfig, keyCascadeModes);

    expect(result).toEqual([]);
    expect(mockValidateKeySync).not.toHaveBeenCalled();
  });
});
