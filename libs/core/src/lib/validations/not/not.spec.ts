import { SyncValidation } from '../../types/validations';
import { createValidation } from '../create-validation';
import { not } from './not';

function valueMustEqual42(message?: string): SyncValidation<number | undefined, unknown> {
  return createValidation((value: number | undefined) => value === 42, message ?? '');
}

describe(not.name, () => {
  it('should return true', () => {
    const validation = not(valueMustEqual42());
    expect(validation(41)).toBe(true);
  });

  it('should return false', () => {
    const validation = not(valueMustEqual42());
    expect(validation(42)).toBe(false);
  });

  it('should return false', () => {
    function valueMustNotEqual42(message?: string): SyncValidation<number | undefined, unknown> {
      return createValidation((value: number | undefined) => value !== 42, message ?? '');
    }

    const validation = not(valueMustNotEqual42());
    expect(validation(undefined)).toBe(false);
  });

  it('should return custom message', () => {
    const validation = not(valueMustEqual42('Custom message'));
    expect(validation.metadata.message).toBe('Custom message');
  });
});
