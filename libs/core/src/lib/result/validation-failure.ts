export interface ValidationFailure {
  propertyName: string;
  message: string;
  attemptedValue: unknown;
}
