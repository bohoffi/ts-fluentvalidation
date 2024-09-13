import { ValidationFn } from '../../types';
import { isTruthy } from '../is-truthy/is-truthy';
import { not } from '../not/not';

export function isFalsy(): ValidationFn;
export function isFalsy(message: string): ValidationFn;
export function isFalsy(message?: string): ValidationFn {
  return not(isTruthy(message || 'Value must be falsy'));
}
