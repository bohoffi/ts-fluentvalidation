import { ValidationFailure } from './validation-failure';

export type ValidationResult = {
  readonly failures: ValidationFailure[];
  readonly isValid: boolean;
  toString(separator?: string): string;
  toDictionary(): Record<string, string[]>;
};

export function createValidationResult(failures: ValidationFailure[] = []): ValidationResult {
  return {
    failures,
    get isValid() {
      return failures.length === 0;
    },
    toString(separator = '\n') {
      return failures.map(e => e.message).join(separator);
    },
    toDictionary() {
      return failures.reduce((acc, { propertyName, message }) => {
        if (!acc[propertyName]) {
          acc[propertyName] = [];
        }

        acc[propertyName].push(message);

        return acc;
      }, {} as Record<string, string[]>);
    }
  };
}
