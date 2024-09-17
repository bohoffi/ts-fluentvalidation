import { length } from './length';

describe(length.name, () => {
  it('should validate length', () => {
    const val = length(1, 3);

    expect(val('bar')).toBe(true);
  });

  it('should not validate length', () => {
    const val = length(1, 3);

    expect(val('hello')).toBe(false);
  });

  it('should return defined message', () => {
    const val = length(1, 3, 'Custom message');

    expect(val.message).toBe('Custom message');
  });
});
