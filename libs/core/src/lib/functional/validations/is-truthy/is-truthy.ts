import { ValidationFn } from '../../types/types';
import { createValidationFn } from '../create-validation-fn';

export function isTruthy(): ValidationFn;
export function isTruthy(message: string): ValidationFn;
export function isTruthy(message?: string): ValidationFn {
  return createValidationFn(value => Boolean(value), message || 'Value must be truthy');
}
