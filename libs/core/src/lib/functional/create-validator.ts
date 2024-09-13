import { ValidationFailure } from './failure';
import { createResult, ValidationResult } from './result';
import { EmptyObject, KeyOf, RulesDictionary, RulesDictionaryInput, ValidationFn } from './types';

export type Validator<T extends object = EmptyObject, R extends RulesDictionary<T> = EmptyObject> = {
  rules(): R;
  ruleFor<K extends KeyOf<T>>(key: K, ...fn: ValidationFn<T[K]>[]): Validator<T, R & RulesDictionaryInput<T, K>>;
  validate(value: T): boolean;
  validateWithFailures(value: T): ValidationFailure[];
  validateWithResult(value: T): ValidationResult;
};

export function createValidator<T extends object = EmptyObject, R extends RulesDictionary<T> = EmptyObject>(): Validator<T, R> {
  const rules: R = {} as R;

  return {
    rules(): R {
      return rules;
    },
    ruleFor<K extends KeyOf<T>>(key: K, ...fn: ValidationFn<T[K]>[]): Validator<T, R & RulesDictionaryInput<T, K>> {
      const keyRules = (rules[key] ?? []) as unknown as ValidationFn<T[K]>[];
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      (rules as any)[key] = keyRules.concat(fn);
      return this as Validator<T, R & RulesDictionaryInput<T, K>>;
    },
    validate(value: T): boolean {
      return Object.entries(rules).every(([key, fns]) => fns.every(fn => fn(value[key as KeyOf<T>])));
    },
    validateWithFailures(value: T): ValidationFailure[] {
      return Object.entries(rules).flatMap(([key, fns]) => {
        const failures = fns.reduce<ValidationFailure[]>((acc, fn) => {
          if (!fn(value[key as KeyOf<T>])) {
            acc.push({
              propertyName: key,
              message: fn.message || 'Validation failed',
              attemptedValue: value[key as KeyOf<T>]
            });
          }
          return acc;
        }, []);
        return failures;
      });
    },
    validateWithResult(value: T): ValidationResult {
      return createResult(this.validateWithFailures(value));
    }
  };
}
