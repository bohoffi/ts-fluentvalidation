import { exclusiveBetween } from './exclusive-between';

describe(exclusiveBetween.name, () => {
  it('should return a validation function that returns true for values between the bounds', () => {
    const validation = exclusiveBetween(1, 10);
    expect(validation(5)).toBe(true);
  });

  it('should return a validation function that returns false for values outside the bounds', () => {
    const validation = exclusiveBetween(1, 10);
    expect(validation(0)).toBe(false);
    expect(validation(11)).toBe(false);
  });

  it('should return a validation function that returns false for null or undefined', () => {
    const validation = exclusiveBetween(1, 10);
    expect(validation(null)).toBe(false);
    expect(validation(undefined)).toBe(false);
  });

  it('should return a validation function that returns false for NaN', () => {
    const validation = exclusiveBetween(1, 10);
    expect(validation(NaN)).toBe(false);
  });

  it('should return custom message', () => {
    const validation = exclusiveBetween(4, 2, 'Custom message');
    expect(validation.message).toBe('Custom message');
  });
});
