import { must } from './must';

describe(must.name, () => {
  it('should return a validation function that returns true if the value meets the specified criteria', () => {
    const isPositive = must<number>(value => (value || 0) > 0);
    expect(isPositive(1)).toBe(true);
  });

  it('should return a validation function that returns false if the value does not meet the specified criteria', () => {
    const isPositive = must<number>(value => (value || 0) > 0);
    expect(isPositive(-1)).toBe(false);
  });

  it('should return a validation function that returns false if the value is null or undefined', () => {
    const isPositive = must<number | null | undefined>(value => (value || 0) > 0);
    expect(isPositive(null)).toBe(false);
    expect(isPositive(undefined)).toBe(false);
  });

  it('should return custom message', () => {
    const validation = must<number>(value => (value || 0) > 0, 'Custom message');
    expect(validation.message).toBe('Custom message');
  });
});
