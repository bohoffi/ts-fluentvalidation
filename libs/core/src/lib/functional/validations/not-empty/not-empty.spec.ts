import { expectValidationErrorCodeToBe, expectValidationMessageToBe } from '../../../../__tests__/assertions';
import { notEmpty } from './not-empty';

describe(notEmpty.name, () => {
  it('should return false for null', () => {
    expect(notEmpty()(null)).toBe(false);
  });

  it('should return false for undefined', () => {
    expect(notEmpty()(undefined)).toBe(false);
  });

  it('should return false for an empty string', () => {
    expect(notEmpty()('')).toBe(false);
  });

  it('should return true for a non empty string', () => {
    expect(notEmpty()('foo')).toBe(true);
  });

  it('should return false for an empty array', () => {
    expect(notEmpty()([])).toBe(false);
  });

  it('should return true for a non empty array', () => {
    expect(notEmpty()([1, 2, 3])).toBe(true);
  });

  it('should return defined message', () => {
    const validation = notEmpty('Custom message');
    expectValidationMessageToBe(validation, 'Custom message');
  });

  it('should return with default metadata', () => {
    const validation = notEmpty();
    expectValidationMessageToBe(validation, 'Value must not be empty.');
    expectValidationErrorCodeToBe(validation, notEmpty.name);
  });
});
