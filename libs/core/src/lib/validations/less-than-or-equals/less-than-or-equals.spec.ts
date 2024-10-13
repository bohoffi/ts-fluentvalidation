import {
  expectValidationErrorCodeToBe,
  expectValidationMessageToBe,
  expectValidationPlaceholdersToBe
} from '../../../__tests__/assertions';
import { DEFAULT_PLACEHOLDERS } from '../message-formatter';
import { lessThanOrEquals } from './less-than-or-equals';

describe(lessThanOrEquals.name, () => {
  it('should return true', () => {
    const validation = lessThanOrEquals(42);
    expect(validation(42)).toBe(true);
  });

  it('should return true', () => {
    const validation = lessThanOrEquals(42);
    expect(validation(41)).toBe(true);
  });

  it('should return false', () => {
    const validation = lessThanOrEquals(42);
    expect(validation(43)).toBe(false);
  });

  it('should return custom message', () => {
    const validation = lessThanOrEquals(42, 'Custom message');
    expectValidationMessageToBe(validation, 'Custom message');
  });

  it('should return with default metadata', () => {
    const validation = lessThanOrEquals(42);
    expectValidationMessageToBe(validation, `'{propertyName}' must be less than or equal to {comparisonValue}.`);
    expectValidationErrorCodeToBe(validation, lessThanOrEquals.name);
  });

  it('should return with default placeholders', () => {
    const validation = lessThanOrEquals(42);
    expectValidationPlaceholdersToBe(validation, {
      [DEFAULT_PLACEHOLDERS.comparisonValue]: 42
    });
  });
});
