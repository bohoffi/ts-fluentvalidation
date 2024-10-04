import { expectValidationMessageToBe } from '../../../../__tests__/assertions';
import { notEquals } from './not-equals';

describe(notEquals.name, () => {
  it('should return true', () => {
    const validation = notEquals(42);
    expect(validation(43)).toBe(true);
  });

  it('should return false', () => {
    const validation = notEquals(42);
    expect(validation(42)).toBe(false);
  });

  it('should return custom message', () => {
    const validation = notEquals(42, 'Custom message');
    expectValidationMessageToBe(validation, 'Custom message');
  });
});
