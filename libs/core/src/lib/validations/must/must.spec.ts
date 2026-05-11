import { expectValidationErrorCodeToBe, expectValidationMessageToBe } from '../../../__tests__/assertions';
import { must } from './must';

describe(must.name, () => {
  it('should return a validation function that returns true if the value meets the specified criteria', () => {
    const isPositive = must<number>(value => (value ?? 0) > 0);
    expect(isPositive(1)).toBe(true);
  });

  it('should return a validation function that returns false if the value does not meet the specified criteria', () => {
    const isPositive = must<number>(value => (value ?? 0) > 0);
    expect(isPositive(-1)).toBe(false);
  });

  it('should return a validation function that returns false if the value is null or undefined', () => {
    const isPositive = must<number | null | undefined>(value => (value ?? 0) > 0);
    expect(isPositive(null)).toBe(false);
    expect(isPositive(undefined)).toBe(false);
  });

  it('should return custom message', () => {
    const validation = must<number>(value => (value ?? 0) > 0, 'Custom message');
    expectValidationMessageToBe(validation, 'Custom message');
  });

  it('should return with default metadata', () => {
    const validation = must<number>(value => (value ?? 0) > 0);
    expectValidationErrorCodeToBe(validation, must.name);
  });
});

describe(must.name + ':model', () => {
  interface TestModel {
    forename: string;
    surname: string;
  }

  it('should return true when model predicate passes', () => {
    const validation = must<string, TestModel>((value, model) => value !== model.forename);
    const model: TestModel = { forename: 'foo', surname: 'bar' };
    expect(validation(model.surname, model)).toBe(true);
  });

  it('should return false when model predicate fails', () => {
    const validation = must<string, TestModel>((value, model) => value !== model.forename);
    const model: TestModel = { forename: 'foo', surname: 'foo' };
    expect(validation(model.surname, model)).toBe(false);
  });

  it('should set the error code', () => {
    const validation = must<string, TestModel>((value, model) => value !== model.forename);
    expectValidationErrorCodeToBe(validation, must.name);
  });

  it('should accept a custom message', () => {
    const validation = must<string, TestModel>((value, model) => value !== model.forename, 'Must differ from forename');
    expectValidationMessageToBe(validation, 'Must differ from forename');
  });
});
