import { BooleanProperty } from '../../types/properties';
import { ValidationFn } from '../../types/types';
import { isTrue } from '../is-true/is-true';
import { not } from '../not/not';

export function isFalse(): ValidationFn<BooleanProperty>;
export function isFalse(message: string): ValidationFn<BooleanProperty>;
export function isFalse(message?: string): ValidationFn<BooleanProperty> {
  return not(isTrue(message || 'Value must be false'));
}
