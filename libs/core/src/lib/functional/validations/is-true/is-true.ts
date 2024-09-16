import { BooleanProperty } from '../../types/properties';
import { ValidationFn } from '../../types/types';
import { createValidationFn } from '../create-validation-fn';

export function isTrue(): ValidationFn<BooleanProperty>;
export function isTrue(message: string): ValidationFn<BooleanProperty>;
export function isTrue(message?: string): ValidationFn<BooleanProperty> {
  return createValidationFn(value => value === true, message || 'Value must be true');
}
