export type ValidationFailure = {
  propertyName: string;
  message: string;
  attemptedValue: unknown;
};

export function createFailure(propertyName: string, message: string, attemptedValue?: unknown): ValidationFailure {
  return {
    propertyName,
    message,
    attemptedValue
  };
}
