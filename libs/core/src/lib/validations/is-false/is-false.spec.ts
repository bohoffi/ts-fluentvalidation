import { expectValidationErrorCodeToBe, expectValidationMessageToBe } from '../../../__tests__/assertions';
import { isFalse } from './is-false';

describe(isFalse.name, () => {
  it('should return true', () => {
    const validation = isFalse();
    expect(validation(false)).toBe(true);
  });

  it('should return false', () => {
    const validation = isFalse();
    expect(validation(true)).toBe(false);
  });

  it('should return custom message', () => {
    const validation = isFalse('Custom message');
    expectValidationMessageToBe(validation, 'Custom message');
  });

  it('should return with default metadata', () => {
    const validation = isFalse();
    expectValidationMessageToBe(validation, `'{propertyName}' must be false.`);
    expectValidationErrorCodeToBe(validation, isFalse.name);
  });
});
