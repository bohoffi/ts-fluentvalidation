import { isNull } from './is-null';

describe(isNull.name, () => {
  it('should return true for null', () => {
    expect(isNull()(null)).toBe(true);
  });

  it('should return false for undefined', () => {
    expect(isNull()(undefined)).toBe(false);
  });

  it('should return false for false', () => {
    expect(isNull()(false)).toBe(false);
  });

  it('should return false for 0', () => {
    expect(isNull()(0)).toBe(false);
  });

  it('should return false for an empty string', () => {
    expect(isNull()('')).toBe(false);
  });
});
