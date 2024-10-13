import {
  expectValidationErrorCodeToBe,
  expectValidationMessageToBe,
  expectValidationPlaceholdersToBe
} from '../../../__tests__/assertions';
import { DEFAULT_PLACEHOLDERS } from '../message-formatter';
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
    expectValidationMessageToBe(validation, `'{propertyName}' must have a maximum length of {maxLength}.`);
    expectValidationErrorCodeToBe(validation, maxLength.name);
  });

  it('should return with default placeholders', () => {
    const validation = maxLength(42);
    expectValidationPlaceholdersToBe(validation, {
      [DEFAULT_PLACEHOLDERS.maxLength]: 42
    });
  });
});
