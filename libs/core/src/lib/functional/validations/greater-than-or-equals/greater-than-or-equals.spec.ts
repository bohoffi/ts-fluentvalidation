import {
  expectValidationErrorCodeToBe,
  expectValidationMessageToBe,
  expectValidationPlaceholdersToBe
} from '../../../../__tests__/assertions';
import { DEFAULT_PLACEHOLDERS } from '../message-formatter';
import { greaterThanOrEquals } from './greater-than-or-equals';

describe(greaterThanOrEquals.name, () => {
  it('should return true', () => {
    const validation = greaterThanOrEquals(42);
    expect(validation(42)).toBe(true);
  });

  it('should return true', () => {
    const validation = greaterThanOrEquals(42);
    expect(validation(43)).toBe(true);
  });

  it('should return false', () => {
    const validation = greaterThanOrEquals(42);
    expect(validation(41)).toBe(false);
  });

  it('should return custom message', () => {
    const validation = greaterThanOrEquals(42, 'Custom message');
    expectValidationMessageToBe(validation, 'Custom message');
  });

  it('should return with default metadata', () => {
    const validation = greaterThanOrEquals(42);
    expectValidationMessageToBe(validation, `'{propertyName}' must be greater than or equal to {comparisonValue}.`);
    expectValidationErrorCodeToBe(validation, greaterThanOrEquals.name);
  });

  it('should return with default placeholders', () => {
    const validation = greaterThanOrEquals(42);
    expectValidationPlaceholdersToBe(validation, {
      [DEFAULT_PLACEHOLDERS.comparisonValue]: 42
    });
  });
});
