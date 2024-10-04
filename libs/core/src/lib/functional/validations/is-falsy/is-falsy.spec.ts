import { expectValidationErrorCodeToBe, expectValidationMessageToBe } from '../../../../__tests__/assertions';
import { isFalsy } from './is-falsy';

describe(isFalsy.name, () => {
  it('should return true for falsy values', () => {
    expect(isFalsy()(null)).toBe(true);
    expect(isFalsy()(undefined)).toBe(true);
    expect(isFalsy()('')).toBe(true);
    expect(isFalsy()(0)).toBe(true);
    expect(isFalsy()(false)).toBe(true);
  });

  it('should return false for truthy values', () => {
    expect(isFalsy()('foo')).toBe(false);
    expect(isFalsy()(1)).toBe(false);
    expect(isFalsy()([])).toBe(false);
    expect(isFalsy()({})).toBe(false);
  });

  it('should return false for null', () => {
    expect(isFalsy()(null)).toBe(true);
  });

  it('should return false for undefined', () => {
    expect(isFalsy()(undefined)).toBe(true);
  });

  it('should return false for false', () => {
    expect(isFalsy()(false)).toBe(true);
  });

  it('should return false for 0', () => {
    expect(isFalsy()(0)).toBe(true);
  });

  it('should return false for an empty string', () => {
    expect(isFalsy()('')).toBe(true);
  });

  it('should return defined message', () => {
    const validation = isFalsy('Custom message');
    expectValidationMessageToBe(validation, 'Custom message');
  });

  it('should return with default metadata', () => {
    const validation = isFalsy();
    expectValidationMessageToBe(validation, 'Value must be falsy.');
    expectValidationErrorCodeToBe(validation, isFalsy.name);
  });
});
