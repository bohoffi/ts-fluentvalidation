import { Severity } from '../types/types';

export type ValidationFailure = {
  propertyName: string;
  message: string;
  attemptedValue?: unknown;
  severity: Severity;
};
