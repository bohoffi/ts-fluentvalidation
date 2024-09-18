import { NumberProperty } from '../../types/properties';
import { ValidationFn } from '../../types/types';
import { createValidationFn } from '../create-validation-fn';

/**
 * Creates a validation function that checks if the value is inclusively between the specified bounds.
 *
 * @param lowerBound - The lower bound.
 * @param upperBound - The upper bound.
 */
export function inclusiveBetween<TModel>(lowerBound: number, upperBound: number): ValidationFn<NumberProperty, TModel>;
/**
 * Creates a validation function that checks if the value is inclusively between the specified bounds.
 *
 * @param lowerBound - The lower bound.
 * @param upperBound - The upper bound.
 * @param message - The message to display if the validation fails.
 */
export function inclusiveBetween<TModel>(lowerBound: number, upperBound: number, message: string): ValidationFn<NumberProperty, TModel>;
export function inclusiveBetween<TModel>(lowerBound: number, upperBound: number, message?: string): ValidationFn<NumberProperty, TModel> {
  return createValidationFn(
    value => (value || 0) >= lowerBound && (value || 0) <= upperBound,
    message || `Value must be between ${lowerBound} and ${upperBound} inclusively.`
  );
}
