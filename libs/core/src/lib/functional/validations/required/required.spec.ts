import { expectValidationErrorCodeToBe, expectValidationMessageToBe } from '../../../../__tests__/assertions';
import { required } from './required';

describe(required.name, () => {
  it('should return an error message when the value is empty', () => {
    const validation = required();
    expect(validation(null)).toBe(false);
    expect(validation(undefined)).toBe(false);
    expect(validation('')).toBe(false);
    expect(validation([])).toBe(false);
  });

  it('should return undefined when the value is not empty', () => {
    const validation = required();
    expect(validation('value')).toBe(true);
    expect(validation(0)).toBe(true);
    expect(validation(false)).toBe(true);
    expect(validation(['value'])).toBe(true);
    expect(validation({ key: 'value' })).toBe(true);
    expect(validation({})).toBe(true);
  });

  it('should return a custom error message when provided', () => {
    const validation = required('Custom error message.');
    expectValidationMessageToBe(validation, 'Custom error message.');
  });

  it('should return with default metadata', () => {
    const validation = required();
    expectValidationMessageToBe(validation, 'Value is required.');
    expectValidationErrorCodeToBe(validation, required.name);
  });
});
