import { greaterThanOrEquals } from './greater-than-or-equals';

describe(greaterThanOrEquals.name, () => {
  it('should return true', () => {
    const validation = greaterThanOrEquals(42);
    expect(validation(42)).toBe(true);
  });

  it('should return true', () => {
    const validation = greaterThanOrEquals(42);
    expect(validation(43)).toBe(true);
  });

  it('should return false', () => {
    const validation = greaterThanOrEquals(42);
    expect(validation(41)).toBe(false);
  });

  it('should return custom message', () => {
    const validation = greaterThanOrEquals(42, 'Custom message');
    expect(validation.message).toBe('Custom message');
  });
});
