import { Severity } from '../types/types';

/**
 * Represents a validation failure.
 */
export interface ValidationFailure {
  /**
   * Gets the name of the property that failed validation.
   */
  propertyName: string;
  /**
   * Gets the error message.
   */
  message: string;
  /**
   * Gets the error code.
   */
  errorCode?: string;
  /**
   * Gets the value that was being validated.
   */
  attemptedValue?: unknown;
  /**
   * Gets the severity of the failure.
   */
  severity: Severity;
}
