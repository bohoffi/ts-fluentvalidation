import { ValidationFn } from '../../types';
import { createValidationFn } from '../../validations';

export function isTruthy(): ValidationFn;
export function isTruthy(message: string): ValidationFn;
export function isTruthy(message?: string): ValidationFn {
  return createValidationFn(value => Boolean(value), message || 'Value must be truthy');
}
