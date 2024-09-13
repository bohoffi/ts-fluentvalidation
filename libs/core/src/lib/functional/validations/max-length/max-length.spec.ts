import { maxLength } from './max-length';

describe('maxLength', () => {
  it('should validate max length', () => {
    const val = maxLength(3);

    expect(val('bar')).toBe(true);
  });

  it('should not validate max length', () => {
    const val = maxLength(3);

    expect(val('hello')).toBe(false);
  });

  it('should return defined message', () => {
    const val = maxLength(3, 'Custom message');

    expect(val.message).toBe('Custom message');
  });
});
