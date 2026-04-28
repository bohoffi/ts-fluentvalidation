import {
  expectValidationErrorCodeToBe,
  expectValidationMessageToBe,
  expectValidationPlaceholdersToBe
} from '../../../__tests__/assertions';
import { DEFAULT_PLACEHOLDERS } from '../message-formatter';
import { equals } from './equals';

describe(equals.name, () => {
  it('should return true', () => {
    const validation = equals(42);
    expect(validation(42)).toBe(true);
  });

  it('should return false', () => {
    const validation = equals(42);
    expect(validation(43)).toBe(false);
  });

  it('should return custom message', () => {
    const validation = equals(42, 'Custom message');
    expectValidationMessageToBe(validation, 'Custom message');
  });

  it('should return with default metadata', () => {
    const validation = equals(42);
    expectValidationErrorCodeToBe(validation, equals.name);
  });

  it('should return with default placeholders', () => {
    const validation = equals(42);
    expectValidationPlaceholdersToBe(validation, {
      [DEFAULT_PLACEHOLDERS.comparisonValue]: 42
    });
  });
});

describe(equals.name + ':model', () => {
  interface TestModel {
    password: string;
    passwordConfirmation: string;
  }

  it('should return true when value matches the property returned by the predicate', () => {
    const validation = equals<string, TestModel, string>(model => model.passwordConfirmation);
    const model: TestModel = { password: 'secret', passwordConfirmation: 'secret' };
    expect(validation(model.password, model)).toBe(true);
  });

  it('should return false when value does not match the property returned by the predicate', () => {
    const validation = equals<string, TestModel, string>(model => model.passwordConfirmation);
    const model: TestModel = { password: 'secret', passwordConfirmation: 'different' };
    expect(validation(model.password, model)).toBe(false);
  });

  it('should set the error code', () => {
    const validation = equals<string, TestModel, string>(model => model.passwordConfirmation);
    expectValidationErrorCodeToBe(validation, equals.name);
  });

  it('should accept a custom message', () => {
    const validation = equals<string, TestModel, string>(model => model.passwordConfirmation, 'Passwords must match');
    expectValidationMessageToBe(validation, 'Passwords must match');
  });

  it('should set comparisonProperty placeholder to the extracted property name', () => {
    const validation = equals<string, TestModel, string>(model => model.passwordConfirmation);
    expectValidationPlaceholdersToBe(validation, {
      [DEFAULT_PLACEHOLDERS.comparisonProperty]: 'passwordConfirmation'
    });
  });

  it('should resolve comparisonValue from the model via the placeholder provider', () => {
    const validation = equals<string, TestModel, string>(model => model.passwordConfirmation);
    const model: TestModel = { password: 'secret', passwordConfirmation: 'abc' };
    validation(model.password, model);
    expectValidationPlaceholdersToBe(validation, {
      [DEFAULT_PLACEHOLDERS.comparisonValue]: 'abc'
    });
  });
});
