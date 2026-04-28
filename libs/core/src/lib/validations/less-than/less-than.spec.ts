import {
  expectValidationErrorCodeToBe,
  expectValidationMessageToBe,
  expectValidationPlaceholdersToBe
} from '../../../__tests__/assertions';
import { DEFAULT_PLACEHOLDERS } from '../message-formatter';
import { lessThan } from './less-than';

describe(lessThan.name, () => {
  it('should return true', () => {
    const validation = lessThan(42);
    expect(validation(41)).toBe(true);
  });

  it('should return false', () => {
    const validation = lessThan(42);
    expect(validation(42)).toBe(false);
  });

  it('should return false', () => {
    const validation = lessThan(42);
    expect(validation(43)).toBe(false);
  });

  it('should return false', () => {
    const validation = lessThan(-1);
    expect(validation(undefined)).toBe(false);
  });

  it('should return custom message', () => {
    const validation = lessThan(42, 'Custom message');
    expectValidationMessageToBe(validation, 'Custom message');
  });

  it('should return with default metadata', () => {
    const validation = lessThan(42);
    expectValidationErrorCodeToBe(validation, lessThan.name);
  });

  it('should return with default placeholders', () => {
    const validation = lessThan(42);
    expectValidationPlaceholdersToBe(validation, {
      [DEFAULT_PLACEHOLDERS.comparisonValue]: 42
    });
  });
});

describe(lessThan.name + ':model', () => {
  interface TestModel {
    score: number;
    maxScore: number;
  }

  it('should return true when value is less than the property returned by the predicate', () => {
    const validation = lessThan<number, TestModel>(model => model.maxScore);
    const model: TestModel = { score: 80, maxScore: 100 };
    expect(validation(model.score, model)).toBe(true);
  });

  it('should return false when value equals the property returned by the predicate', () => {
    const validation = lessThan<number, TestModel>(model => model.maxScore);
    const model: TestModel = { score: 100, maxScore: 100 };
    expect(validation(model.score, model)).toBe(false);
  });

  it('should return false when value is greater than the property returned by the predicate', () => {
    const validation = lessThan<number, TestModel>(model => model.maxScore);
    const model: TestModel = { score: 110, maxScore: 100 };
    expect(validation(model.score, model)).toBe(false);
  });

  it('should set the error code', () => {
    const validation = lessThan<number, TestModel>(model => model.maxScore);
    expectValidationErrorCodeToBe(validation, lessThan.name);
  });

  it('should accept a custom message', () => {
    const validation = lessThan<number, TestModel>(model => model.maxScore, 'Score must be less than max score');
    expectValidationMessageToBe(validation, 'Score must be less than max score');
  });

  it('should set comparisonProperty placeholder to the extracted property name', () => {
    const validation = lessThan<number, TestModel>(model => model.maxScore);
    expectValidationPlaceholdersToBe(validation, {
      [DEFAULT_PLACEHOLDERS.comparisonProperty]: 'maxScore'
    });
  });

  it('should resolve comparisonValue from the model via the placeholder provider', () => {
    const validation = lessThan<number, TestModel>(model => model.maxScore);
    const model: TestModel = { score: 80, maxScore: 100 };
    validation(model.score, model);
    expectValidationPlaceholdersToBe(validation, {
      [DEFAULT_PLACEHOLDERS.comparisonValue]: 100
    });
  });
});
