import {
  expectValidationErrorCodeToBe,
  expectValidationMessageToBe,
  expectValidationPlaceholdersToBe
} from '../../../__tests__/assertions';
import { DEFAULT_PLACEHOLDERS } from '../message-formatter';
import { lessThan } from './less-than';

describe(lessThan.name, () => {
  it('should return true', () => {
    const validation = lessThan(42);
    expect(validation(41)).toBe(true);
  });

  it('should return false', () => {
    const validation = lessThan(42);
    expect(validation(42)).toBe(false);
  });

  it('should return false', () => {
    const validation = lessThan(42);
    expect(validation(43)).toBe(false);
  });

  it('should return custom message', () => {
    const validation = lessThan(42, 'Custom message');
    expectValidationMessageToBe(validation, 'Custom message');
  });

  it('should return with default metadata', () => {
    const validation = lessThan(42);
    expectValidationMessageToBe(validation, `'{propertyName}' must be less than {comparisonValue}.`);
    expectValidationErrorCodeToBe(validation, lessThan.name);
  });

  it('should return with default placeholders', () => {
    const validation = lessThan(42);
    expectValidationPlaceholdersToBe(validation, {
      [DEFAULT_PLACEHOLDERS.comparisonValue]: 42
    });
  });
});
