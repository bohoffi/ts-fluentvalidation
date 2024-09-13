import { lessThan } from './less-than';

describe(lessThan.name, () => {
  it('should return true', () => {
    const validation = lessThan(42);
    expect(validation(41)).toBe(true);
  });

  it('should return false', () => {
    const validation = lessThan(42);
    expect(validation(42)).toBe(false);
  });

  it('should return false', () => {
    const validation = lessThan(42);
    expect(validation(43)).toBe(false);
  });

  it('should return custom message', () => {
    const validation = lessThan(42, 'Custom message');
    expect(validation.message).toBe('Custom message');
  });
});
