import { NumberProperty } from '../../types/properties';
import { ValidationFn } from '../../types/types';
import { createValidationFn } from '../create-validation-fn';

export function inclusiveBetween<TModel>(lowerBound: number, upperBound: number): ValidationFn<NumberProperty, TModel>;
export function inclusiveBetween<TModel>(lowerBound: number, upperBound: number, message: string): ValidationFn<NumberProperty, TModel>;
export function inclusiveBetween<TModel>(lowerBound: number, upperBound: number, message?: string): ValidationFn<NumberProperty, TModel> {
  return createValidationFn(
    value => (value || 0) >= lowerBound && (value || 0) <= upperBound,
    message || `Value must be between ${lowerBound} and ${upperBound} inclusively`
  );
}
