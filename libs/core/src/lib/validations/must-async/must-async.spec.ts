import { expectValidationErrorCodeToBe, expectValidationMessageToBe } from '../../../__tests__/assertions';
import { mustAsync } from './must-async';

describe(mustAsync.name, () => {
  it('should return a validation function that returns true if the value meets the specified criteria', async () => {
    const isPositive = mustAsync<number>(value => Promise.resolve((value ?? 0) > 0));
    expect(await isPositive(1)).toBe(true);
  });

  it('should return a validation function that returns false if the value does not meet the specified criteria', async () => {
    const isPositive = mustAsync<number>(value => Promise.resolve((value ?? 0) > 0));
    expect(await isPositive(-1)).toBe(false);
  });

  it('should return a validation function that returns false if the value is null or undefined', async () => {
    const isPositive = mustAsync<number | null | undefined>(value => Promise.resolve((value ?? 0) > 0));
    expect(await isPositive(null)).toBe(false);
    expect(await isPositive(undefined)).toBe(false);
  });

  it('should return custom message', () => {
    const validation = mustAsync<number>(value => Promise.resolve((value ?? 0) > 0), 'Custom message');
    expectValidationMessageToBe(validation, 'Custom message');
  });

  it('should return with default metadata', () => {
    const validation = mustAsync<number>(value => Promise.resolve((value ?? 0) > 0));
    expectValidationErrorCodeToBe(validation, mustAsync.name);
  });
});

describe(mustAsync.name + ':model', () => {
  interface TestModel {
    forename: string;
    surname: string;
  }

  it('should return true when model predicate passes', async () => {
    const validation = mustAsync<string, TestModel>((value, model) => Promise.resolve(value !== model.forename));
    const model: TestModel = { forename: 'foo', surname: 'bar' };
    expect(await validation(model.surname, model)).toBe(true);
  });

  it('should return false when model predicate fails', async () => {
    const validation = mustAsync<string, TestModel>((value, model) => Promise.resolve(value !== model.forename));
    const model: TestModel = { forename: 'foo', surname: 'foo' };
    expect(await validation(model.surname, model)).toBe(false);
  });

  it('should set the error code', () => {
    const validation = mustAsync<string, TestModel>((value, model) => Promise.resolve(value !== model.forename));
    expectValidationErrorCodeToBe(validation, mustAsync.name);
  });

  it('should accept a custom message', () => {
    const validation = mustAsync<string, TestModel>((value, model) => Promise.resolve(value !== model.forename), 'Must differ from forename');
    expectValidationMessageToBe(validation, 'Must differ from forename');
  });
});
