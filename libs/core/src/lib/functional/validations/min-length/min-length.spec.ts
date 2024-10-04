import { expectValidationErrorCodeToBe, expectValidationMessageToBe } from '../../../../__tests__/assertions';
import { minLength } from './min-length';

describe(minLength.name, () => {
  it('should return true if the value length is greater than or equal to the min', () => {
    const min = 5;
    const validationFn = minLength(min);
    expect(validationFn('12345')).toBe(true);
    expect(validationFn('123456')).toBe(true);
  });

  it('should return false if the value length is less than the min', () => {
    const min = 5;
    const validationFn = minLength(min);
    expect(validationFn('1234')).toBe(false);
  });

  it('should return true if the value is null or undefined', () => {
    const min = 5;
    const validationFn = minLength(min);
    expect(validationFn(null)).toBe(false);
    expect(validationFn(undefined)).toBe(false);
  });

  it('should return false if the value is an empty string', () => {
    const min = 5;
    const validationFn = minLength(min);
    expect(validationFn('')).toBe(false);
  });

  it('should return defined message', () => {
    const validation = minLength(3, 'Custom message');
    expectValidationMessageToBe(validation, 'Custom message');
  });

  it('should return with default metadata', () => {
    const validation = minLength(42);
    expectValidationMessageToBe(validation, 'Value must have a minimum length of 42.');
    expectValidationErrorCodeToBe(validation, minLength.name);
  });
});
