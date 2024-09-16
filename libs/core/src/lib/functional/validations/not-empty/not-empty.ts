import { LengthProperty } from '../../types/properties';
import { ValidationFn } from '../../types/types';
import { empty } from '../empty/empty';
import { not } from '../not/not';

export function notEmpty(): ValidationFn<LengthProperty>;
export function notEmpty(message: string): ValidationFn<LengthProperty>;
export function notEmpty(message?: string): ValidationFn<LengthProperty> {
  return not(empty(message || 'Value must not be empty'));
}
