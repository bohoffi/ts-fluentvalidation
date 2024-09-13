import { BooleanProperty, ValidationFn } from '../../types';
import { createValidationFn } from '../../validations';

export function isTrue(): ValidationFn<BooleanProperty>;
export function isTrue(message: string): ValidationFn<BooleanProperty>;
export function isTrue(message?: string): ValidationFn<BooleanProperty> {
  return createValidationFn(value => value === true, message || 'Value must be true');
}
