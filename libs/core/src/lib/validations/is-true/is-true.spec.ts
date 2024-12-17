import { expectValidationErrorCodeToBe, expectValidationMessageToBe } from '../../../__tests__/assertions';
import { isTrue } from './is-true';

describe(isTrue.name, () => {
  it('should return true', () => {
    const validation = isTrue();
    expect(validation(true)).toBe(true);
  });

  it('should return false', () => {
    const validation = isTrue();
    expect(validation(false)).toBe(false);
  });

  it('should return custom message', () => {
    const validation = isTrue('Custom message');
    expectValidationMessageToBe(validation, 'Custom message');
  });

  it('should return with default metadata', () => {
    const validation = isTrue();
    expectValidationErrorCodeToBe(validation, isTrue.name);
  });
});
