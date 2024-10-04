import { expectValidationMessageToBe } from '../../../../__tests__/assertions';
import { isNull } from './is-null';

describe(isNull.name, () => {
  it('should return true for null', () => {
    expect(isNull()(null)).toBe(true);
  });

  it('should return false for undefined', () => {
    expect(isNull()(undefined)).toBe(false);
  });

  it('should return false for false', () => {
    expect(isNull()(false)).toBe(false);
  });

  it('should return false for 0', () => {
    expect(isNull()(0)).toBe(false);
  });

  it('should return false for an empty string', () => {
    expect(isNull()('')).toBe(false);
  });

  it('should return defined message', () => {
    const validation = isNull('Custom message');
    expectValidationMessageToBe(validation, 'Custom message');
  });
});
