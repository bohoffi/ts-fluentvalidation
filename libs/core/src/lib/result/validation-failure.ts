/**
 * Represents a validation failure.
 */
export interface ValidationFailure {
  /**
   * The name of the property that was being validated.
   */
  propertyName: string;
  /**
   * The error message.
   */
  message: string;
  /**
   * The property value that was being validated.
   */
  attemptedValue: unknown;
}
