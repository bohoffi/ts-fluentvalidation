import {
  expectValidationErrorCodeToBe,
  expectValidationMessageToBe,
  expectValidationPlaceholdersToBe
} from '../../../__tests__/assertions';
import { DEFAULT_PLACEHOLDERS } from '../message-formatter';
import { greaterThan } from './greater-than';

describe(greaterThan.name, () => {
  it('should return true', () => {
    const validation = greaterThan(42);
    expect(validation(43)).toBe(true);
  });

  it('should return false', () => {
    const validation = greaterThan(42);
    expect(validation(42)).toBe(false);
  });

  it('should return false', () => {
    const validation = greaterThan(42);
    expect(validation(41)).toBe(false);
  });

  it('should return false', () => {
    const validation = greaterThan(42);
    expect(validation(undefined)).toBe(false);
  });

  it('should return custom message', () => {
    const validation = greaterThan(42, 'Custom message');
    expectValidationMessageToBe(validation, 'Custom message');
  });

  it('should return with default metadata', () => {
    const validation = greaterThan(42);
    expectValidationErrorCodeToBe(validation, greaterThan.name);
  });

  it('should return with default placeholders', () => {
    const validation = greaterThan(42);
    expectValidationPlaceholdersToBe(validation, {
      [DEFAULT_PLACEHOLDERS.comparisonValue]: 42
    });
  });
});

describe(greaterThan.name + ':model', () => {
  interface TestModel {
    salary: number;
    minSalary: number;
  }

  it('should return true when value is greater than the property returned by the predicate', () => {
    const validation = greaterThan<number, TestModel>(model => model.minSalary);
    const model: TestModel = { salary: 5000, minSalary: 3000 };
    expect(validation(model.salary, model)).toBe(true);
  });

  it('should return false when value equals the property returned by the predicate', () => {
    const validation = greaterThan<number, TestModel>(model => model.minSalary);
    const model: TestModel = { salary: 3000, minSalary: 3000 };
    expect(validation(model.salary, model)).toBe(false);
  });

  it('should return false when value is less than the property returned by the predicate', () => {
    const validation = greaterThan<number, TestModel>(model => model.minSalary);
    const model: TestModel = { salary: 2000, minSalary: 3000 };
    expect(validation(model.salary, model)).toBe(false);
  });

  it('should set the error code', () => {
    const validation = greaterThan<number, TestModel>(model => model.minSalary);
    expectValidationErrorCodeToBe(validation, greaterThan.name);
  });

  it('should accept a custom message', () => {
    const validation = greaterThan<number, TestModel>(model => model.minSalary, 'Salary must exceed minimum salary');
    expectValidationMessageToBe(validation, 'Salary must exceed minimum salary');
  });

  it('should set comparisonProperty placeholder to the extracted property name', () => {
    const validation = greaterThan<number, TestModel>(model => model.minSalary);
    expectValidationPlaceholdersToBe(validation, {
      [DEFAULT_PLACEHOLDERS.comparisonProperty]: 'minSalary'
    });
  });

  it('should resolve comparisonValue from the model via the placeholder provider', () => {
    const validation = greaterThan<number, TestModel>(model => model.minSalary);
    const model: TestModel = { salary: 5000, minSalary: 3000 };
    validation(model.salary, model);
    expectValidationPlaceholdersToBe(validation, {
      [DEFAULT_PLACEHOLDERS.comparisonValue]: 3000
    });
  });
});
