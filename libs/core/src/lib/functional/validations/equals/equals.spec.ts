import { equals } from './equals';

describe(equals.name, () => {
  it('should return true', () => {
    const validation = equals(42);
    expect(validation(42)).toBe(true);
  });

  it('should return false', () => {
    const validation = equals(42);
    expect(validation(43)).toBe(false);
  });

  it('should return custom message', () => {
    const validation = equals(42, 'Custom message');
    expect(validation.message).toBe('Custom message');
  });
});
