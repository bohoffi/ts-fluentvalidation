import { matches } from './matches';

describe(matches.name, () => {
  it('should validate if value matches pattern', () => {
    const result = matches(/hello/);

    expect(result('hello')).toBe(true);
  });

  it('should not validate if value does not match pattern', () => {
    const result = matches(/hello/);

    expect(result('world')).toBe(false);
  });

  it('should return a function that returns false with a message', () => {
    const result = matches(/hello/, 'Value must match pattern');

    expect(result('world')).toBe(false);
  });

  it('should return defined message', () => {
    const val = matches(/hello/, 'Custom message');

    expect(val.message).toBe('Custom message');
  });
});
