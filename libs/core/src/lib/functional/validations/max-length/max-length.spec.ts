import { expectValidationErrorCodeToBe, expectValidationMessageToBe } from '../../../../__tests__/assertions';
import { maxLength } from './max-length';

describe(maxLength.name, () => {
  it('should validate max length', () => {
    const val = maxLength(3);

    expect(val('bar')).toBe(true);
  });

  it('should not validate max length', () => {
    const val = maxLength(3);

    expect(val('hello')).toBe(false);
  });

  it('should return defined message', () => {
    const validation = maxLength(3, 'Custom message');
    expectValidationMessageToBe(validation, 'Custom message');
  });

  it('should return with default metadata', () => {
    const validation = maxLength(42);
    expectValidationMessageToBe(validation, 'Value must have a maximum length of 42.');
    expectValidationErrorCodeToBe(validation, maxLength.name);
  });
});
