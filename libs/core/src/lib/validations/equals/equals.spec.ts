import {
  expectValidationErrorCodeToBe,
  expectValidationMessageToBe,
  expectValidationPlaceholdersToBe
} from '../../../__tests__/assertions';
import { DEFAULT_PLACEHOLDERS } from '../message-formatter';
import { equals } from './equals';

describe(equals.name, () => {
  it('should return true', () => {
    const validation = equals(42);
    expect(validation(42)).toBe(true);
  });

  it('should return false', () => {
    const validation = equals(42);
    expect(validation(43)).toBe(false);
  });

  it('should return custom message', () => {
    const validation = equals(42, 'Custom message');
    expectValidationMessageToBe(validation, 'Custom message');
  });

  it('should return with default metadata', () => {
    const validation = equals(42);
    expectValidationMessageToBe(validation, `'{propertyName}' must equal {comparisonValue}.`);
    expectValidationErrorCodeToBe(validation, equals.name);
  });

  it('should return with default placeholders', () => {
    const validation = equals(42);
    expectValidationPlaceholdersToBe(validation, {
      [DEFAULT_PLACEHOLDERS.comparisonValue]: 42
    });
  });
});
