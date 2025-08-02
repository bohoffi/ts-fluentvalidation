import { ValidationFailure } from './result/validation-failure';

/**
 * Represents the context for validation operations.
 *
 * @template T - The type of the model being validated.
 */
export interface ValidationContext<T> {
  /**
   * The validation failures that have occurred.
   */
  failures: ValidationFailure[];
  /**
   * The model to validate.
   */
  modelToValidate: T;
  /**
   * The name of the parent property, if any.
   */
  parentPropertyName?: string;
  /**
   * Adds the given failures to the context.
   *
   * @param failures - The failures to add to the context.
   */
  addFailures(...failures: ValidationFailure[]): void;
}

/**
 * Creates a validation context for a given model.
 *
 * @template T - The type of the model to validate.
 * @param model - The model to validate.
 * @param parentPropertyName - The name of the parent property, if any.
 * @returns The validation context containing the model and any validation failures.
 */
export function createValidationContext<T>(model: T, parentPropertyName?: string): ValidationContext<T> {
  return {
    failures: [] as ValidationFailure[],
    modelToValidate: model,
    parentPropertyName,
    addFailures(...failures: ValidationFailure[]): void {
      this.failures.push(...failures);
    }
  };
}

export function isValidationContext<T>(value: unknown): value is ValidationContext<T> {
  return value != null && typeof value === 'object' && 'failures' in value && 'modelToValidate' in value;
}
