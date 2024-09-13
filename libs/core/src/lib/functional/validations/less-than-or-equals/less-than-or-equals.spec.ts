import { lessThanOrEquals } from './less-than-or-equals';

describe(lessThanOrEquals.name, () => {
  it('should return true', () => {
    const validation = lessThanOrEquals(42);
    expect(validation(42)).toBe(true);
  });

  it('should return true', () => {
    const validation = lessThanOrEquals(42);
    expect(validation(41)).toBe(true);
  });

  it('should return false', () => {
    const validation = lessThanOrEquals(42);
    expect(validation(43)).toBe(false);
  });

  it('should return custom message', () => {
    const validation = lessThanOrEquals(42, 'Custom message');
    expect(validation.message).toBe('Custom message');
  });
});
