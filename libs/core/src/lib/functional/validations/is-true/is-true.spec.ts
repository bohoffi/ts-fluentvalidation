import { isTrue } from './is-true';

describe(isTrue.name, () => {
  it('should return true', () => {
    const validation = isTrue();
    expect(validation(true)).toBe(true);
  });

  it('should return false', () => {
    const validation = isTrue();
    expect(validation(false)).toBe(false);
  });

  it('should return custom message', () => {
    const validation = isTrue('Custom message');
    expect(validation.message).toBe('Custom message');
  });
});
