import { createValidator } from '../lib/create-validator';
import { AsyncValidation, SyncValidation } from '../lib/types';
import { must, mustAsync } from '../lib/validations';
import { testValidate, testValidateAsync } from '../testing/src/test-validate';
import { expectFailureLength, expectResultInvalid, expectValidationsFor, expectValidationsForWithLength } from './assertions';
import { createOrderWith, createPersonWith, Order, Person } from './fixtures';

describe('ruleForEach', () => {
  describe('add validations for items', () => {
    it('should add rule for each item', () => {
      const validator = createValidator<Person>().ruleForEach(
        'orders',
        must(order => order.productName !== '')
      );

      expectValidationsFor(validator, 'orders');
      expectValidationsForWithLength(validator, 'orders', 1);
    });

    it('should add multiple validations for each item', () => {
      const validator = createValidator<Person>().ruleForEach(
        'orders',
        must(order => order.productName !== ''),
        must(order => order.amount > 0)
      );

      expectValidationsFor(validator, 'orders');
      expectValidationsForWithLength(validator, 'orders', 2);
    });

    it('should add multiple validations for each item on subsequent calls', () => {
      const validator = createValidator<Person>()
        .ruleForEach(
          'orders',
          must(order => order.productName !== '')
        )
        .ruleForEach(
          'orders',
          must(order => order.amount > 0)
        );

      expectValidationsFor(validator, 'orders');
      expectValidationsForWithLength(validator, 'orders', 2);
    });

    it('should add custom synchronous rule for each item', () => {
      function productNameShouldNotBeEmpty<TModel>(): SyncValidation<Order, TModel> {
        return must((order: Order) => order.productName !== '', 'Product name must not be empty.');
      }

      const validator = createValidator<Person>().ruleForEach('orders', productNameShouldNotBeEmpty());
      const result = testValidate(validator, createPersonWith({ orders: [createOrderWith(), createOrderWith({ productName: '' })] }));
      expectResultInvalid(result);
      expectFailureLength(result, 1);
      result.shouldHaveValidationErrorFor('orders[1]').withMessage('Product name must not be empty.');
    });

    it('should add custom asynchronous rule for each item', async () => {
      function productNameShouldNotBeEmpty<TModel>(): AsyncValidation<Order, TModel> {
        return mustAsync((order: Order) => Promise.resolve(order.productName !== ''), 'Product name must not be empty.');
      }

      const validator = createValidator<Person>().ruleForEach('orders', productNameShouldNotBeEmpty());
      const result = await testValidateAsync(
        validator,
        createPersonWith({ orders: [createOrderWith(), createOrderWith({ productName: '' })] })
      );
      expectResultInvalid(result);
      expectFailureLength(result, 1);
      result.shouldHaveValidationErrorFor('orders[1]').withMessage('Product name must not be empty.');
    });
  });

  describe('cascadeMode', () => {
    const ruleForEachPerson = createPersonWith({
      orders: [createOrderWith({ productName: '', amount: 0 }), createOrderWith({ productName: '', amount: 0 })]
    });

    it('should stop synchronous validation on first failure with propertyCascadeMode set to Stop', () => {
      const validator = createValidator<Person>().ruleForEach(
        'orders',
        'Stop',
        must(order => order.productName !== '')
      );

      const result = testValidate(validator, ruleForEachPerson);
      expectResultInvalid(result);
      expectFailureLength(result, 1);
      result.shouldHaveValidationErrorFor('orders[0]').withMessage(`'orders[0]' must meet the specified criteria.`);
    });

    it('should continue synchronous validation on failure with propertyCascadeMode set to Continue or undefined', () => {
      const validator = createValidator<Person>().ruleForEach(
        'orders',
        'Continue',
        must(order => order.productName !== '')
      );

      const result = testValidate(validator, ruleForEachPerson);
      expectResultInvalid(result);
      expectFailureLength(result, 2);
      result.shouldHaveValidationErrorFor('orders[0]').withMessage(`'orders[0]' must meet the specified criteria.`);
      result.shouldHaveValidationErrorFor('orders[1]').withMessage(`'orders[1]' must meet the specified criteria.`);
    });

    it('should stop asynchronous validation on first failure with propertyCascadeMode set to Stop', async () => {
      const validator = createValidator<Person>().ruleForEach(
        'orders',
        'Stop',
        must(order => order.productName !== '')
      );

      const result = await testValidateAsync(validator, ruleForEachPerson);
      expectResultInvalid(result);
      expectFailureLength(result, 1);
      result.shouldHaveValidationErrorFor('orders[0]').withMessage(`'orders[0]' must meet the specified criteria.`);
    });

    it('should continue asynchronous validation on failure with propertyCascadeMode set to Continue or undefined', async () => {
      const validator = createValidator<Person>().ruleForEach(
        'orders',
        'Continue',
        must(order => order.productName !== '')
      );

      const result = await testValidateAsync(validator, ruleForEachPerson);
      expectResultInvalid(result);
      expectFailureLength(result, 2);
      result.shouldHaveValidationErrorFor('orders[0]').withMessage(`'orders[0]' must meet the specified criteria.`);
      result.shouldHaveValidationErrorFor('orders[1]').withMessage(`'orders[1]' must meet the specified criteria.`);
    });

    it('should not overwrite CascadeMode of preceeding ruleForForEach call for the same key', () => {
      const validator = createValidator<Person>()
        .ruleForEach(
          'orders',
          'Stop',
          must(order => order.productName !== '')
        )
        .ruleForEach(
          'orders',
          'Continue',
          must(order => order.amount > 0, 'Amount must be positive.')
        );

      const result = testValidate(validator, ruleForEachPerson);
      expectResultInvalid(result);
      expectFailureLength(result, 3);
      result.shouldHaveValidationErrorFor('orders[0]').withMessage(`'orders[0]' must meet the specified criteria.`);
      result.shouldHaveValidationErrorFor('orders[0]').withMessage('Amount must be positive.');
      result.shouldHaveValidationErrorFor('orders[1]').withMessage('Amount must be positive.');
    });
  });
});
