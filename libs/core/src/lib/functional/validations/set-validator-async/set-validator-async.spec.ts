import { expectValidationErrorCodeToBe, expectValidationMessageToBeUndefined } from '../../../../__tests__/assertions';
import { Address, createAddressWith } from '../../../../__tests__/fixtures';
import { createValidator } from '../../create-validator';
import { mustAsync } from '../must-async/must-async';
import { setValidatorAsync } from './set-validator-async';

describe(setValidatorAsync.name, () => {
  const addressValidator = createValidator<Address>().ruleFor(
    'city',
    mustAsync(city => Promise.resolve(city !== ''))
  );

  it('should return true', async () => {
    const validation = setValidatorAsync(addressValidator);
    expect(await validation(createAddressWith())).toBe(true);
  });

  it('should return true when value is `null`', async () => {
    const validation = setValidatorAsync(addressValidator);
    expect(await validation(null)).toBe(true);
  });

  it('should return true when value is `undefined`', async () => {
    const validation = setValidatorAsync(addressValidator);
    expect(await validation(undefined)).toBe(true);
  });

  it('should return false', async () => {
    const validation = setValidatorAsync(addressValidator);
    expect(
      await validation(
        createAddressWith({
          city: ''
        })
      )
    ).toBe(false);
  });

  it('should return with default metadata', () => {
    const validation = setValidatorAsync(addressValidator);
    expectValidationMessageToBeUndefined(validation);
    expectValidationErrorCodeToBe(validation, setValidatorAsync.name);
    expect(validation.validator).toBeDefined();
  });
});
