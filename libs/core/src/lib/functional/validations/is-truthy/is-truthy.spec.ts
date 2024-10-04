import { expectValidationErrorCodeToBe, expectValidationMessageToBe } from '../../../../__tests__/assertions';
import { isTruthy } from './is-truthy';

describe(isTruthy.name, () => {
  it('should return true for truthy values', () => {
    expect(isTruthy()('foo')).toBe(true);
    expect(isTruthy()(1)).toBe(true);
    expect(isTruthy()([])).toBe(true);
    expect(isTruthy()({})).toBe(true);
  });

  it('should return false for falsy values', () => {
    expect(isTruthy()(null)).toBe(false);
    expect(isTruthy()(undefined)).toBe(false);
    expect(isTruthy()('')).toBe(false);
    expect(isTruthy()(0)).toBe(false);
    expect(isTruthy()(false)).toBe(false);
  });

  it('should return false for null', () => {
    expect(isTruthy()(null)).toBe(false);
  });

  it('should return false for undefined', () => {
    expect(isTruthy()(undefined)).toBe(false);
  });

  it('should return false for false', () => {
    expect(isTruthy()(false)).toBe(false);
  });

  it('should return false for 0', () => {
    expect(isTruthy()(0)).toBe(false);
  });

  it('should return false for an empty string', () => {
    expect(isTruthy()('')).toBe(false);
  });

  it('should return defined message', () => {
    const validation = isTruthy('Custom message');
    expectValidationMessageToBe(validation, 'Custom message');
  });

  it('should return with default metadata', () => {
    const validation = isTruthy();
    expectValidationMessageToBe(validation, `'{propertyName}' must be truthy.`);
    expectValidationErrorCodeToBe(validation, isTruthy.name);
  });
});
