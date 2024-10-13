import { expectValidationErrorCodeToBe, expectValidationMessageToBe } from '../../../__tests__/assertions';
import { notNull } from './not-null';

describe(notNull.name, () => {
  it('should return false for null', () => {
    expect(notNull()(null)).toBe(false);
  });

  it('should return true for undefined', () => {
    expect(notNull()(undefined)).toBe(true);
  });

  it('should return true for false', () => {
    expect(notNull()(false)).toBe(true);
  });

  it('should return true for 0', () => {
    expect(notNull()(0)).toBe(true);
  });

  it('should return true for an empty string', () => {
    expect(notNull()('')).toBe(true);
  });

  it('should return defined message', () => {
    const validation = notNull('Custom message');
    expectValidationMessageToBe(validation, 'Custom message');
  });

  it('should return with default metadata', () => {
    const validation = notNull();
    expectValidationMessageToBe(validation, `'{propertyName}' must not be null.`);
    expectValidationErrorCodeToBe(validation, notNull.name);
  });
});
