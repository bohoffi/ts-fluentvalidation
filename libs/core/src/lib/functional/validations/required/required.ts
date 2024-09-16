import { isLengthProperty } from '../../types/properties';
import { ValidationFn } from '../../types/types';
import { createValidationFn } from '../create-validation-fn';

export function required(): ValidationFn;
export function required(message: string): ValidationFn;
export function required(message?: string): ValidationFn {
  return createValidationFn(value => !isEmptyValue(value), message || 'Value is required.');
}

function isEmptyValue(value: unknown): boolean {
  return value == null || (isLengthProperty(value) && value.length === 0);
}
