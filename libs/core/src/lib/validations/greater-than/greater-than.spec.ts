import {
  expectValidationErrorCodeToBe,
  expectValidationMessageToBe,
  expectValidationPlaceholdersToBe
} from '../../../__tests__/assertions';
import { DEFAULT_PLACEHOLDERS } from '../message-formatter';
import { greaterThan } from './greater-than';

describe(greaterThan.name, () => {
  it('should return true', () => {
    const validation = greaterThan(42);
    expect(validation(43)).toBe(true);
  });

  it('should return false', () => {
    const validation = greaterThan(42);
    expect(validation(42)).toBe(false);
  });

  it('should return false', () => {
    const validation = greaterThan(42);
    expect(validation(41)).toBe(false);
  });

  it('should return false', () => {
    const validation = greaterThan(42);
    expect(validation(undefined)).toBe(false);
  });

  it('should return custom message', () => {
    const validation = greaterThan(42, 'Custom message');
    expectValidationMessageToBe(validation, 'Custom message');
  });

  it('should return with default metadata', () => {
    const validation = greaterThan(42);
    expectValidationMessageToBe(validation, `'{propertyName}' must be greater than {comparisonValue}.`);
    expectValidationErrorCodeToBe(validation, greaterThan.name);
  });

  it('should return with default placeholders', () => {
    const validation = greaterThan(42);
    expectValidationPlaceholdersToBe(validation, {
      [DEFAULT_PLACEHOLDERS.comparisonValue]: 42
    });
  });
});
