import { notNull } from './not-null';

describe(notNull.name, () => {
  it('should return false for null', () => {
    expect(notNull()(null)).toBe(false);
  });

  it('should return true for undefined', () => {
    expect(notNull()(undefined)).toBe(true);
  });

  it('should return true for false', () => {
    expect(notNull()(false)).toBe(true);
  });

  it('should return true for 0', () => {
    expect(notNull()(0)).toBe(true);
  });

  it('should return true for an empty string', () => {
    expect(notNull()('')).toBe(true);
  });
});
