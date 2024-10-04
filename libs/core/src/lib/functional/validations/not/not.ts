import { SyncValidation } from '../../types/types';
import { createValidation } from '../create-validation-fn';

export function not<TValue = unknown, TModel = unknown>(validation: SyncValidation<TValue, TModel>): SyncValidation<TValue, TModel> {
  return createValidation(value => !validation(value), validation.metadata.message || '');
}
