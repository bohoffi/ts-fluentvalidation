import { expectValidationErrorCodeToBe, expectValidationMessageToBe } from '../../../../__tests__/assertions';
import { empty } from './empty';

describe(empty.name, () => {
  it('should return true for null', () => {
    expect(empty()(null)).toBe(true);
  });

  it('should return true for undefined', () => {
    expect(empty()(undefined)).toBe(true);
  });

  it('should return true for an empty string', () => {
    expect(empty()('')).toBe(true);
  });

  it('should return false for a non empty string', () => {
    expect(empty()('foo')).toBe(false);
  });

  it('should return true for an empty array', () => {
    expect(empty()([])).toBe(true);
  });

  it('should return false for a non empty array', () => {
    expect(empty()([1, 2, 3])).toBe(false);
  });

  it('should return defined message', () => {
    const validation = empty('Custom message');
    expectValidationMessageToBe(validation, 'Custom message');
  });

  it('should return with default metadata', () => {
    const validation = empty();
    expectValidationMessageToBe(validation, `'{propertyName}' must be empty.`);
    expectValidationErrorCodeToBe(validation, empty.name);
  });
});
