import { ValidationFn } from '../../types/types';
import { isNull } from '../is-null/is-null';
import { not } from '../not/not';

export function notNull(): ValidationFn;
export function notNull(message: string): ValidationFn;
export function notNull(message?: string): ValidationFn {
  return not(isNull(message || 'Value must not be null'));
}
