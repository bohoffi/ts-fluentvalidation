import { expectValidationErrorCodeToBe, expectValidationMessageToBe } from '../../../../__tests__/assertions';
import { length } from './length';

describe(length.name, () => {
  it('should validate length', () => {
    const val = length(1, 3);

    expect(val('bar')).toBe(true);
  });

  it('should not validate length', () => {
    const val = length(1, 3);

    expect(val('hello')).toBe(false);
  });

  it('should return defined message', () => {
    const validation = length(1, 3, 'Custom message');
    expectValidationMessageToBe(validation, 'Custom message');
  });

  it('should return with default metadata', () => {
    const validation = length(1, 3);
    expectValidationMessageToBe(validation, 'Value must have a length between (inclusive) 1 and 3.');
    expectValidationErrorCodeToBe(validation, length.name);
  });
});
