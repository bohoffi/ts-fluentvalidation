import { SyncValidation } from '../../types/types';
import { createValidation } from '../create-validation-fn';

/**
 * Creates an inverted validation function.
 *
 * @param validation - The validation function to invert.
 * @returns The inverted validation function.
 */
export function not<TValue = unknown, TModel = unknown>(validation: SyncValidation<TValue, TModel>): SyncValidation<TValue, TModel> {
  return createValidation(value => !validation(value), validation.metadata.message || '');
}
