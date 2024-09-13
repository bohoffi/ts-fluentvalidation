import { NumberProperty, ValidationFn } from '../../types';
import { createValidationFn } from '../../validations';

export function exclusiveBetween(lowerBound: number, upperBound: number): ValidationFn<NumberProperty>;
export function exclusiveBetween(lowerBound: number, upperBound: number, message: string): ValidationFn<NumberProperty>;
export function exclusiveBetween(lowerBound: number, upperBound: number, message?: string): ValidationFn<NumberProperty> {
  return createValidationFn(
    value => (value || 0) > lowerBound && (value || 0) < upperBound,
    message || `Value must be between ${lowerBound} and ${upperBound} exclusively`
  );
}
