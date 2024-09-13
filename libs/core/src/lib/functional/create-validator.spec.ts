import { createValidator } from './create-validator';
import { minLength } from './validations/min-length/min-length';
import { matches } from './validations/matches/matches';

describe(createValidator.name, () => {
  describe('validate', () => {
    it('should validate object', () => {
      const val = createValidator<{ foo: string; bar: number; baz: boolean }>()
        .ruleFor('foo', minLength(1))
        .ruleFor('bar', value => value !== null)
        .ruleFor('baz', value => value !== null);

      expect(val.validate({ foo: 'hello', bar: 42, baz: true })).toBe(true);
    });

    it('should not validate object', () => {
      const val = createValidator<{ foo: string; bar: number; baz: boolean }>()
        .ruleFor('foo', minLength(1))
        .ruleFor('bar', value => value !== null)
        .ruleFor('baz', value => value !== null);

      expect(val.validate({ foo: '', bar: 42, baz: true })).toBe(false);
    });

    it('should validate matches', () => {
      const val = createValidator<{ foo: string }>().ruleFor('foo', matches(/hello/));

      expect(val.validate({ foo: 'hello' })).toBe(true);
    });

    it('should validate multiple rules', () => {
      const val = createValidator<{ foo: string }>().ruleFor('foo', minLength(1), matches(/hello/));

      expect(val.validate({ foo: 'hello' })).toBe(true);
    });

    it('should not validate multiple rules', () => {
      const val = createValidator<{ foo: string }>().ruleFor('foo', minLength(6), matches(/hello/));

      expect(val.validate({ foo: 'hello' })).toBe(false);
    });

    it('should return defined rule', () => {
      const val = createValidator<{ foo: string; bar: number }>().ruleFor('foo', minLength(1), matches(/hello/));

      expect(val.rules()).toEqual({ foo: [expect.any(Function), expect.any(Function)] });
      expect(val.rules().foo.length).toBe(2);

      const updatedVal = val.ruleFor('bar', value => value !== null);
      expect(updatedVal.rules()).toEqual({ foo: [expect.any(Function), expect.any(Function)], bar: [expect.any(Function)] });
      expect(updatedVal.rules().bar.length).toBe(1);
    });
  });

  describe('validateWithFailures', () => {
    it('should validate object and return failures', () => {
      const val = createValidator<{ foo: string; bar: number; baz: boolean }>()
        .ruleFor('foo', minLength(1))
        .ruleFor('bar', value => value !== null)
        .ruleFor('baz', value => value !== null);

      const failures = val.validateWithFailures({ foo: '', bar: 42, baz: true });
      expect(failures).toEqual([{ propertyName: 'foo', message: 'Value must have a minimum length of 1', attemptedValue: '' }]);
    });

    it('should validate matches and return failures', () => {
      const val = createValidator<{ foo: string }>().ruleFor('foo', matches(/hello/));

      const failures = val.validateWithFailures({ foo: 'world' });
      expect(failures).toEqual([{ propertyName: 'foo', message: 'Value must match pattern', attemptedValue: 'world' }]);
    });

    it('should validate multiple rules and return failures', () => {
      const val = createValidator<{ foo: string; bar: number }>()
        .ruleFor('foo', minLength(6), matches(/hello/))
        .ruleFor('bar', value => value !== 0);

      const failures = val.validateWithFailures({ foo: 'world', bar: 0 });
      expect(failures).toEqual([
        { propertyName: 'foo', message: 'Value must have a minimum length of 6', attemptedValue: 'world' },
        { propertyName: 'foo', message: 'Value must match pattern', attemptedValue: 'world' },
        { propertyName: 'bar', message: 'Validation failed', attemptedValue: 0 }
      ]);
    });
  });

  describe('validateWithResult', () => {
    it('should validate object and return result', () => {
      const val = createValidator<{ foo: string; bar: number; baz: boolean }>()
        .ruleFor('foo', minLength(1))
        .ruleFor('bar', value => value !== null)
        .ruleFor('baz', value => value !== null);

      const result = val.validateWithResult({ foo: '', bar: 42, baz: true });
      expect(result.isValid).toBe(false);
      expect(result.failures).toEqual([{ propertyName: 'foo', message: 'Value must have a minimum length of 1', attemptedValue: '' }]);
    });

    it('should validate matches and return result', () => {
      const val = createValidator<{ foo: string }>().ruleFor('foo', matches(/hello/));

      const result = val.validateWithResult({ foo: 'world' });
      expect(result.isValid).toBe(false);
      expect(result.failures).toEqual([{ propertyName: 'foo', message: 'Value must match pattern', attemptedValue: 'world' }]);
    });

    it('should validate multiple rules and return result', () => {
      const val = createValidator<{ foo: string; bar: number }>()
        .ruleFor('foo', minLength(6), matches(/hello/))
        .ruleFor('bar', value => value !== 0);

      const result = val.validateWithResult({ foo: 'world', bar: 0 });
      expect(result.isValid).toBe(false);
      expect(result.failures).toEqual([
        { propertyName: 'foo', message: 'Value must have a minimum length of 6', attemptedValue: 'world' },
        { propertyName: 'foo', message: 'Value must match pattern', attemptedValue: 'world' },
        { propertyName: 'bar', message: 'Validation failed', attemptedValue: 0 }
      ]);
    });
  });
});
