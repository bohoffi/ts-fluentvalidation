import {
  expectValidationErrorCodeToBe,
  expectValidationMessageToBe,
  expectValidationPlaceholdersToBe
} from '../../../__tests__/assertions';
import { DEFAULT_PLACEHOLDERS } from '../message-formatter';
import { lessThanOrEquals } from './less-than-or-equals';

describe(lessThanOrEquals.name, () => {
  it('should return true', () => {
    const validation = lessThanOrEquals(42);
    expect(validation(42)).toBe(true);
  });

  it('should return true', () => {
    const validation = lessThanOrEquals(42);
    expect(validation(41)).toBe(true);
  });

  it('should return false', () => {
    const validation = lessThanOrEquals(42);
    expect(validation(43)).toBe(false);
  });

  it('should return false', () => {
    const validation = lessThanOrEquals(-1);
    expect(validation(undefined)).toBe(false);
  });

  it('should return custom message', () => {
    const validation = lessThanOrEquals(42, 'Custom message');
    expectValidationMessageToBe(validation, 'Custom message');
  });

  it('should return with default metadata', () => {
    const validation = lessThanOrEquals(42);
    expectValidationErrorCodeToBe(validation, lessThanOrEquals.name);
  });

  it('should return with default placeholders', () => {
    const validation = lessThanOrEquals(42);
    expectValidationPlaceholdersToBe(validation, {
      [DEFAULT_PLACEHOLDERS.comparisonValue]: 42
    });
  });
});

describe(lessThanOrEquals.name + ':model', () => {
  interface TestModel {
    age: number;
    maxAge: number;
  }

  it('should return true when value is less than the property returned by the predicate', () => {
    const validation = lessThanOrEquals<number, TestModel>(model => model.maxAge);
    const model: TestModel = { age: 17, maxAge: 18 };
    expect(validation(model.age, model)).toBe(true);
  });

  it('should return true when value equals the property returned by the predicate', () => {
    const validation = lessThanOrEquals<number, TestModel>(model => model.maxAge);
    const model: TestModel = { age: 18, maxAge: 18 };
    expect(validation(model.age, model)).toBe(true);
  });

  it('should return false when value is greater than the property returned by the predicate', () => {
    const validation = lessThanOrEquals<number, TestModel>(model => model.maxAge);
    const model: TestModel = { age: 19, maxAge: 18 };
    expect(validation(model.age, model)).toBe(false);
  });

  it('should set the error code', () => {
    const validation = lessThanOrEquals<number, TestModel>(model => model.maxAge);
    expectValidationErrorCodeToBe(validation, lessThanOrEquals.name);
  });

  it('should accept a custom message', () => {
    const validation = lessThanOrEquals<number, TestModel>(model => model.maxAge, 'Age must not exceed max age');
    expectValidationMessageToBe(validation, 'Age must not exceed max age');
  });

  it('should set comparisonProperty placeholder to the extracted property name', () => {
    const validation = lessThanOrEquals<number, TestModel>(model => model.maxAge);
    expectValidationPlaceholdersToBe(validation, {
      [DEFAULT_PLACEHOLDERS.comparisonProperty]: 'maxAge'
    });
  });

  it('should resolve comparisonValue from the model via the placeholder provider', () => {
    const validation = lessThanOrEquals<number, TestModel>(model => model.maxAge);
    const model: TestModel = { age: 17, maxAge: 18 };
    validation(model.age, model);
    expectValidationPlaceholdersToBe(validation, {
      [DEFAULT_PLACEHOLDERS.comparisonValue]: 18
    });
  });
});
