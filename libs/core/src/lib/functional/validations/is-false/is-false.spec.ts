import { isFalse } from './is-false';

describe(isFalse.name, () => {
  it('should return true', () => {
    const validation = isFalse();
    expect(validation(false)).toBe(true);
  });

  it('should return false', () => {
    const validation = isFalse();
    expect(validation(true)).toBe(false);
  });

  it('should return custom message', () => {
    const validation = isFalse('Custom message');
    expect(validation.message).toBe('Custom message');
  });
});
