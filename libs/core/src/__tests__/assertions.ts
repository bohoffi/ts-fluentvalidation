import { ValidationResult } from '../lib/result';
import { AsyncValidation, InferValidations, KeyOf, SyncValidation, Validation, ValidationMetadata, Validator } from '../lib/types';

export function expectResultValid(result: ValidationResult): void {
  expect(result.isValid).toBe(true);
}

export function expectResultInvalid(result: ValidationResult): void {
  expect(result.isValid).toBe(false);
}

export function expectFailureLength(result: ValidationResult, length: number): void {
  expect(result.failures).toHaveLength(length);
}

export function expectValidationsFor<T extends object, Validations extends object = InferValidations<Validator<T>>>(
  validator: Validator<T, Validations>,
  validationsKey: KeyOf<T>
): void {
  expect(validator.validations).toHaveProperty(validationsKey);
}

export function expectValidationsForWithLength<T extends object, Validations extends object = InferValidations<Validator<T>>>(
  validator: Validator<T, Validations>,
  validationsKey: KeyOf<Validator<T, Validations>['validations']>,
  length: number
): void {
  expect((validator.validations as any)[validationsKey]).toHaveLength(length);
}

export function expectValidationToPass<TValue, TModel extends object>(validation: SyncValidation<TValue, TModel>, value: TValue): void {
  expect(validation(value)).toBe(true);
}

export async function expectValidationToPassAsync<TValue, TModel extends object>(
  validation: AsyncValidation<TValue, TModel>,
  value: TValue
): Promise<void> {
  expect(await validation(value)).toBe(true);
}

export function expectValidationToFail<TValue, TModel extends object>(validation: SyncValidation<TValue, TModel>, value: TValue): void {
  expect(validation(value)).toBe(false);
}

export async function expectValidationToFailAsync<TValue, TModel extends object>(
  validation: AsyncValidation<TValue, TModel>,
  value: TValue
): Promise<void> {
  expect(await validation(value)).toBe(false);
}

export function expectValidationMessageToBe<TValue, TModel extends object>(validation: Validation<TValue, TModel>, message: string): void {
  expect(validation.metadata.message).toBe(message);
}

export function expectValidationMessageToBeUndefined<TValue, TModel extends object>(validation: Validation<TValue, TModel>): void {
  expect(validation.metadata.message).toBeUndefined();
}

export function expectValidationErrorCodeToBe<TValue, TModel extends object>(
  validation: Validation<TValue, TModel>,
  errorCode: string
): void {
  expect(validation.metadata.errorCode).toBe(errorCode);
}

export function expectValidationErrorCodeToBeUndefined<TValue, TModel extends object>(validation: Validation<TValue, TModel>): void {
  expect(validation.metadata.errorCode).toBeUndefined();
}

export function expectValidationPropertyNameToBe<TValue, TModel extends object>(
  validation: Validation<TValue, TModel>,
  propertyName: string
): void {
  expect(validation.metadata.propertyName).toBe(propertyName);
}

export function expectValidationPropertyNameToBeUndefined<TValue, TModel extends object>(validation: Validation<TValue, TModel>): void {
  expect(validation.metadata.propertyName).toBeUndefined();
}

export function expectValidationPlaceholdersToBe<TValue, TModel extends object>(
  validation: Validation<TValue, TModel>,
  placeholders: Record<string, unknown>
): void {
  expect(validation.metadata.placeholders).toEqual(placeholders);
}

export function expectValidationMetadataToBeDefined<TValue, TModel>(
  validation: Validation<TValue, TModel>,
  metadataKey: KeyOf<ValidationMetadata<boolean, TModel>>
): void {
  expect(validation.metadata[metadataKey]).toBeDefined();
}

export function expectValidationsMetadataToBeDefined<T extends object, Validations extends object = InferValidations<Validator<T>>>(
  validator: Validator<T, Validations>,
  validationsKey: KeyOf<Validator<T, Validations>['validations']>,
  validationIndex: number,
  metadataKey: KeyOf<ValidationMetadata<boolean, T>>
): void {
  expect((validator.validations as any)[validationsKey][validationIndex].metadata[metadataKey]).toBeDefined();
}

export function expectValidationsMetadataToBeUndefined<T extends object, Validations extends object = InferValidations<Validator<T>>>(
  validator: Validator<T, Validations>,
  validationsKey: KeyOf<Validator<T, Validations>['validations']>,
  validationIndex: number,
  metadataKey: KeyOf<ValidationMetadata<boolean, T>>
): void {
  expect((validator.validations as any)[validationsKey][validationIndex].metadata[metadataKey]).toBeUndefined();
}

export function expectValidationsMetadataToBe<T extends object, E, Validations extends object = InferValidations<Validator<T>>>(
  validator: Validator<T, Validations>,
  validationsKey: KeyOf<Validator<T, Validations>['validations']>,
  validationIndex: number,
  metadataKey: KeyOf<ValidationMetadata<boolean, T>>,
  expected: E
): void {
  expect((validator.validations as any)[validationsKey][validationIndex].metadata[metadataKey]).toBe(expected);
}
