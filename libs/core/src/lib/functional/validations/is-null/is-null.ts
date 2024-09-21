import { SyncValidation } from '../../types/types';
import { createValidation } from '../create-validation-fn';

export function isNull<TValue, TModel>(): SyncValidation<TValue, TModel>;
export function isNull<TValue, TModel>(message: string): SyncValidation<TValue, TModel>;
export function isNull<TValue, TModel>(message?: string): SyncValidation<TValue, TModel> {
  return createValidation(value => value === null, message || 'Value must be null.');
}
