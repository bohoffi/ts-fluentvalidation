import { expectValidationErrorCodeToBe, expectValidationMessageToBe } from '../../../__tests__/assertions';
import { matches } from './matches';

describe(matches.name, () => {
  it('should validate if value matches pattern', () => {
    const result = matches(/hello/);

    expect(result('hello')).toBe(true);
  });

  it('should not validate if value does not match pattern', () => {
    const result = matches(/hello/);

    expect(result('world')).toBe(false);
  });

  it('should return a function that returns false with a message', () => {
    const result = matches(/hello/, 'Value must match pattern');

    expect(result('world')).toBe(false);
  });

  it('should return defined message', () => {
    const validation = matches(/hello/, 'Custom message');
    expectValidationMessageToBe(validation, 'Custom message');
  });

  it('should return with default metadata', () => {
    const validation = matches(/hello/);
    expectValidationMessageToBe(validation, `'{propertyName}' must match pattern.`);
    expectValidationErrorCodeToBe(validation, matches.name);
  });
});
