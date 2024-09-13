import { ValidationFn, BooleanProperty } from '../../types';
import { not } from '../not/not';
import { isTrue } from '../is-true/is-true';

export function isFalse(): ValidationFn<BooleanProperty>;
export function isFalse(message: string): ValidationFn<BooleanProperty>;
export function isFalse(message?: string): ValidationFn<BooleanProperty> {
  return not(isTrue(message || 'Value must be false'));
}
