import { isLengthProperty } from '../../types/properties';
import { SyncValidation } from '../../types/types';
import { createValidation } from '../create-validation-fn';

/**
 * Creates a validation function that checks if the value is neither nullish nor empty.
 */
export function required<TValue, TModel>(): SyncValidation<TValue, TModel>;
/**
 * Creates a validation function that checks if the value is neither nullish nor empty.
 *
 * @param message - The message to display if the validation fails.
 */
export function required<TValue, TModel>(message: string): SyncValidation<TValue, TModel>;
export function required<TValue, TModel>(message?: string): SyncValidation<TValue, TModel> {
  return createValidation(value => !isEmptyValue(value), {
    message: message || `'{propertyName}' is required.`,
    errorCode: required.name
  });
}

function isEmptyValue(value: unknown): boolean {
  return value == null || (isLengthProperty(value) && value.length === 0);
}
