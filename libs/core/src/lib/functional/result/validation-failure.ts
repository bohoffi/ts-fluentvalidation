import { Severity } from '../types/types';

export type ValidationFailure = {
  propertyName: string;
  message: string;
  errorCode?: string;
  attemptedValue?: unknown;
  severity: Severity;
};
