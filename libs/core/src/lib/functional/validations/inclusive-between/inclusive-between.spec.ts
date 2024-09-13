import { inclusiveBetween } from './inclusive-between';

describe('inclusiveBetween', () => {
  it('should return a validation function that passes when the value is between the bounds', () => {
    const validation = inclusiveBetween(1, 5);
    expect(validation(3)).toBe(true);
  });

  it('should return a validation function that passes when the value is equal to the lower bound', () => {
    const validation = inclusiveBetween(1, 5);
    expect(validation(1)).toBe(true);
  });

  it('should return a validation function that passes when the value is equal to the upper bound', () => {
    const validation = inclusiveBetween(1, 5);
    expect(validation(5)).toBe(true);
  });

  it('should return a validation function that fails when the value is less than the lower bound', () => {
    const validation = inclusiveBetween(1, 5);
    expect(validation(0)).toBe(false);
  });

  it('should return a validation function that fails when the value is greater than the upper bound', () => {
    const validation = inclusiveBetween(1, 5);
    expect(validation(6)).toBe(false);
  });

  it('should return a validation function that fails when the value is null', () => {
    const validation = inclusiveBetween(1, 5);
    expect(validation(null)).toBe(false);
  });

  it('should return a validation function that fails when the value is undefined', () => {
    const validation = inclusiveBetween(1, 5);
    expect(validation(undefined)).toBe(false);
  });

  it('should return a validation function that fails when the value is NaN', () => {
    const validation = inclusiveBetween(1, 5);
    expect(validation(NaN)).toBe(false);
  });

  it('should return custom message', () => {
    const validation = inclusiveBetween(4, 2, 'Custom message');
    expect(validation.message).toBe('Custom message');
  });
});
