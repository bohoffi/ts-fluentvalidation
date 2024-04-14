import { ValidationFailure } from './validation-failure';

/**
 * Represents the result of a validation operation.
 */
export class ValidationResult {
  /**
   * Gets a value indicating whether the validation result is valid.
   */
  public get isValid(): boolean {
    return this.errors.length === 0;
  }

  /**
   * Gets the list of validation failures.
   */
  public get errors(): ValidationFailure[] {
    return [...this.failures];
  }

  /**
   * Initializes a new instance of the ValidationResult class.
   * @param failures The list of validation failures.
   */
  constructor(private readonly failures: ValidationFailure[] = []) {}

  /**
   * Returns a string representation of the error messages.
   *
   * @param separator - The separator to use between error messages. Defaults to '\n'.
   * @returns A string containing all the error messages joined by the separator.
   */
  public toString(separator = '\n'): string {
    return this.errors.map(e => e.message).join(separator);
  }

  /**
   * Converts the validation errors into a dictionary where the property names are the keys
   * and the error messages are the values.
   * @returns A dictionary object where the keys are property names and the values are arrays of error messages.
   */
  public toDictionary(): Record<string, string[]> {
    return this.errors.reduce((acc, { propertyName, message }) => {
      if (!acc[propertyName]) {
        acc[propertyName] = [];
      }

      acc[propertyName].push(message);

      return acc;
    }, {} as Record<string, string[]>);
  }
}
