import {
  expectValidationErrorCodeToBe,
  expectValidationMessageToBe,
  expectValidationPlaceholdersToBe
} from '../../../__tests__/assertions';
import { DEFAULT_PLACEHOLDERS } from '../message-formatter';
import { length } from './length';

describe(length.name, () => {
  it('should validate length', () => {
    const val = length(1, 3);

    expect(val('bar')).toBe(true);
  });

  it('should not validate length', () => {
    const val = length(1, 3);

    expect(val('hello')).toBe(false);
  });

  it('should not validate length', () => {
    const val = length(1, 3);

    expect(val(undefined)).toBe(false);
  });

  it('should return defined message', () => {
    const validation = length(1, 3, 'Custom message');
    expectValidationMessageToBe(validation, 'Custom message');
  });

  it('should return with default metadata', () => {
    const validation = length(1, 3);
    expectValidationMessageToBe(validation, `'{propertyName}' must have a length between (inclusive) {minLength} and {maxLength}.`);
    expectValidationErrorCodeToBe(validation, length.name);
  });

  it('should return with default placeholders', () => {
    const validation = length(1, 3);
    expectValidationPlaceholdersToBe(validation, {
      [DEFAULT_PLACEHOLDERS.minLength]: 1,
      [DEFAULT_PLACEHOLDERS.maxLength]: 3
    });
  });
});
