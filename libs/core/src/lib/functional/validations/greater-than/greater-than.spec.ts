import { greaterThan } from './greater-than';

describe(greaterThan.name, () => {
  it('should return true', () => {
    const validation = greaterThan(42);
    expect(validation(43)).toBe(true);
  });

  it('should return false', () => {
    const validation = greaterThan(42);
    expect(validation(42)).toBe(false);
  });

  it('should return false', () => {
    const validation = greaterThan(42);
    expect(validation(41)).toBe(false);
  });

  it('should return custom message', () => {
    const validation = greaterThan(42, 'Custom message');
    expect(validation.message).toBe('Custom message');
  });
});
