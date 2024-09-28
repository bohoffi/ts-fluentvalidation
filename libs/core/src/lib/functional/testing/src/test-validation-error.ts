/**
 * Represents a test validation error.
 */
export class TestValidationError extends Error {
  constructor(message: string) {
    super(message);
    this.name = 'TestValidationError';
  }
}
