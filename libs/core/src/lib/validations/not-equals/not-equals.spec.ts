import {
  expectValidationErrorCodeToBe,
  expectValidationMessageToBe,
  expectValidationPlaceholdersToBe
} from '../../../__tests__/assertions';
import { DEFAULT_PLACEHOLDERS } from '../message-formatter';
import { notEquals } from './not-equals';

describe(notEquals.name, () => {
  it('should return true', () => {
    const validation = notEquals(42);
    expect(validation(43)).toBe(true);
  });

  it('should return false', () => {
    const validation = notEquals(42);
    expect(validation(42)).toBe(false);
  });

  it('should return custom message', () => {
    const validation = notEquals(42, 'Custom message');
    expectValidationMessageToBe(validation, 'Custom message');
  });

  it('should return with default metadata', () => {
    const validation = notEquals(42);
    expectValidationErrorCodeToBe(validation, notEquals.name);
  });

  it('should return with default placeholders', () => {
    const validation = notEquals(42);
    expectValidationPlaceholdersToBe(validation, {
      [DEFAULT_PLACEHOLDERS.comparisonValue]: 42
    });
  });
});

describe(notEquals.name + ':model', () => {
  interface TestModel {
    username: string;
    reservedName: string;
  }

  it('should return true when value does not match the property returned by the predicate', () => {
    const validation = notEquals<string, TestModel, string>(model => model.reservedName);
    const model: TestModel = { username: 'alice', reservedName: 'admin' };
    expect(validation(model.username, model)).toBe(true);
  });

  it('should return false when value matches the property returned by the predicate', () => {
    const validation = notEquals<string, TestModel, string>(model => model.reservedName);
    const model: TestModel = { username: 'admin', reservedName: 'admin' };
    expect(validation(model.username, model)).toBe(false);
  });

  it('should set the error code', () => {
    const validation = notEquals<string, TestModel, string>(model => model.reservedName);
    expectValidationErrorCodeToBe(validation, notEquals.name);
  });

  it('should accept a custom message', () => {
    const validation = notEquals<string, TestModel, string>(model => model.reservedName, 'Username must not match reserved name');
    expectValidationMessageToBe(validation, 'Username must not match reserved name');
  });

  it('should set comparisonProperty placeholder to the extracted property name', () => {
    const validation = notEquals<string, TestModel, string>(model => model.reservedName);
    expectValidationPlaceholdersToBe(validation, {
      [DEFAULT_PLACEHOLDERS.comparisonProperty]: 'reservedName'
    });
  });

  it('should resolve comparisonValue from the model via the placeholder provider', () => {
    const validation = notEquals<string, TestModel, string>(model => model.reservedName);
    const model: TestModel = { username: 'alice', reservedName: 'admin' };
    validation(model.username, model);
    expectValidationPlaceholdersToBe(validation, {
      [DEFAULT_PLACEHOLDERS.comparisonValue]: 'admin'
    });
  });
});
