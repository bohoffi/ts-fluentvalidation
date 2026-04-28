import {
  expectValidationErrorCodeToBe,
  expectValidationMessageToBe,
  expectValidationPlaceholdersToBe
} from '../../../__tests__/assertions';
import { DEFAULT_PLACEHOLDERS } from '../message-formatter';
import { greaterThanOrEquals } from './greater-than-or-equals';

describe(greaterThanOrEquals.name, () => {
  it('should return true', () => {
    const validation = greaterThanOrEquals(42);
    expect(validation(42)).toBe(true);
  });

  it('should return true', () => {
    const validation = greaterThanOrEquals(42);
    expect(validation(43)).toBe(true);
  });

  it('should return false', () => {
    const validation = greaterThanOrEquals(42);
    expect(validation(41)).toBe(false);
  });

  it('should return false', () => {
    const validation = greaterThanOrEquals(42);
    expect(validation(undefined)).toBe(false);
  });

  it('should return custom message', () => {
    const validation = greaterThanOrEquals(42, 'Custom message');
    expectValidationMessageToBe(validation, 'Custom message');
  });

  it('should return with default metadata', () => {
    const validation = greaterThanOrEquals(42);
    expectValidationErrorCodeToBe(validation, greaterThanOrEquals.name);
  });

  it('should return with default placeholders', () => {
    const validation = greaterThanOrEquals(42);
    expectValidationPlaceholdersToBe(validation, {
      [DEFAULT_PLACEHOLDERS.comparisonValue]: 42
    });
  });
});

describe(greaterThanOrEquals.name + ':model', () => {
  interface TestModel {
    quantity: number;
    minQuantity: number;
  }

  it('should return true when value is greater than the property returned by the predicate', () => {
    const validation = greaterThanOrEquals<number, TestModel>(model => model.minQuantity);
    const model: TestModel = { quantity: 10, minQuantity: 5 };
    expect(validation(model.quantity, model)).toBe(true);
  });

  it('should return true when value equals the property returned by the predicate', () => {
    const validation = greaterThanOrEquals<number, TestModel>(model => model.minQuantity);
    const model: TestModel = { quantity: 5, minQuantity: 5 };
    expect(validation(model.quantity, model)).toBe(true);
  });

  it('should return false when value is less than the property returned by the predicate', () => {
    const validation = greaterThanOrEquals<number, TestModel>(model => model.minQuantity);
    const model: TestModel = { quantity: 3, minQuantity: 5 };
    expect(validation(model.quantity, model)).toBe(false);
  });

  it('should set the error code', () => {
    const validation = greaterThanOrEquals<number, TestModel>(model => model.minQuantity);
    expectValidationErrorCodeToBe(validation, greaterThanOrEquals.name);
  });

  it('should accept a custom message', () => {
    const validation = greaterThanOrEquals<number, TestModel>(model => model.minQuantity, 'Quantity must meet the minimum');
    expectValidationMessageToBe(validation, 'Quantity must meet the minimum');
  });

  it('should set comparisonProperty placeholder to the extracted property name', () => {
    const validation = greaterThanOrEquals<number, TestModel>(model => model.minQuantity);
    expectValidationPlaceholdersToBe(validation, {
      [DEFAULT_PLACEHOLDERS.comparisonProperty]: 'minQuantity'
    });
  });

  it('should resolve comparisonValue from the model via the placeholder provider', () => {
    const validation = greaterThanOrEquals<number, TestModel>(model => model.minQuantity);
    const model: TestModel = { quantity: 10, minQuantity: 5 };
    validation(model.quantity, model);
    expectValidationPlaceholdersToBe(validation, {
      [DEFAULT_PLACEHOLDERS.comparisonValue]: 5
    });
  });
});
