import { Severity } from '../models';

/**
 * Represents a validation failure.
 */
export class ValidationFailure {
  /**
   * The name of the property that was being validated.
   */
  public propertyName: string;
  /**
   * The error message.
   */
  public message: string;
  /**
   * The property value that was being validated.
   */
  public attemptedValue: unknown;

  /**
   * The severity of the validation failure.
   */
  public severity: Severity = 'Error';

  /**
   * The error code associated with the validation failure.
   */
  public errorCode?: string;

  constructor(propertyName: string, message: string, attemptedValue: unknown) {
    this.propertyName = propertyName;
    this.message = message;
    this.attemptedValue = attemptedValue;
  }
}
