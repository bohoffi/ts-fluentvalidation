import { expectValidationErrorCodeToBe, expectValidationMessageToBeUndefined } from '../../../__tests__/assertions';
import { Address, createAddressWith } from '../../../__tests__/fixtures';
import { createValidator } from '../../create-validator';
import { notEmpty } from '../not-empty/not-empty';
import { setValidator } from './set-validator';

describe(setValidator.name, () => {
  const addressValidator = createValidator<Address>().ruleFor('city', notEmpty());

  it('should return true', () => {
    const validation = setValidator(addressValidator);
    expect(validation(createAddressWith())).toBe(true);
  });

  it('should return true when value is `null`', () => {
    const validation = setValidator(addressValidator);
    expect(validation(null)).toBe(true);
  });

  it('should return true when value is `undefined`', () => {
    const validation = setValidator(addressValidator);
    expect(validation(undefined)).toBe(true);
  });

  it('should return false', () => {
    const validation = setValidator(addressValidator);
    expect(
      validation(
        createAddressWith({
          city: ''
        })
      )
    ).toBe(false);
  });

  it('should return with default metadata', () => {
    const validation = setValidator(addressValidator);
    expectValidationMessageToBeUndefined(validation);
    expectValidationErrorCodeToBe(validation, setValidator.name);
    expect(validation.validator).toBeDefined();
  });
});
