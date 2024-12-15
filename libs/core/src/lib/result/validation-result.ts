import { ValidationFailure } from './validation-failure';

/**
 * Represents the result of a validation operation.
 */
export interface ValidationResult {
  /**
   * Gets the validation failures.
   */
  readonly failures: ValidationFailure[];
  /**
   * Gets a value indicating whether the validation operation succeeded.
   */
  readonly isValid: boolean;
  /**
   * Adds the specified validation failures to the result.
   *
   * @param validationFailures The validation failures to add.
   */
  addFailures(...validationFailures: ValidationFailure[]): void;
  /**
   * Joins all failure messages into a single string.
   *
   * @param separator The separator to use when joining the failure messages.
   */
  toString(separator?: string): string;
  /**
   * Converts the validation failures to a dictionary.
   */
  toDictionary(): Record<string, string[]>;
}

export function createValidationResult(failures: ValidationFailure[] = []): ValidationResult {
  return {
    failures,
    get isValid(): boolean {
      return failures.length === 0;
    },
    addFailures(...validationFailures: ValidationFailure[]): void {
      failures.push(...validationFailures);
    },
    toString(separator = '\n'): string {
      return failures.map(e => e.message).join(separator);
    },
    toDictionary(): Record<string, string[]> {
      return failures.reduce<Record<string, string[]>>((acc, { propertyName, message }) => {
        if (!acc[propertyName]) {
          acc[propertyName] = [];
        }

        acc[propertyName].push(message);

        return acc;
      }, {});
    }
  };
}
