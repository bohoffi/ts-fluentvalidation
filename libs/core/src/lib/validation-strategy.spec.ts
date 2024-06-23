import { AbstractValidator } from './abstract-validator';
import { createPersonWith } from './testing/test-data';
import { Person } from './testing/test-models';
import { ValidationStrategy } from './validation-strategy';
import { testValidate } from '../testing';

class PersonValidator extends AbstractValidator<Person> {
  constructor() {
    super();
  }
}

let personValidator: PersonValidator;

describe(ValidationStrategy.name, () => {
  beforeEach(() => {
    personValidator = new PersonValidator();
  });

  describe('includeProperties', () => {
    it('should validate single property specified by string', () => {
      personValidator.ruleFor('name').notEmpty();
      personValidator.ruleFor('age').greaterThanOrEqualTo(18);

      const result = testValidate(
        personValidator,
        createPersonWith({
          name: '',
          age: 17
        }),
        strategy => strategy.includeProperties('name')
      );

      expect(result.isValid).toBe(false);
      result.shouldHaveValidationErrorFor('name');
      result.shouldNotHaveValidationErrorFor('age');
    });

    it('should validate multiple properties specified by string', () => {
      personValidator.ruleFor('name').notEmpty();
      personValidator.ruleFor('age').greaterThanOrEqualTo(18);
      personValidator.ruleFor('notice').minLength(5);

      const result = testValidate(
        personValidator,
        createPersonWith({
          name: '',
          age: 17
        }),
        strategy => strategy.includeProperties('name', 'age')
      );

      expect(result.isValid).toBe(false);
      result.shouldHaveValidationErrorFor('name');
      result.shouldHaveValidationErrorFor('age');
      result.shouldNotHaveValidationErrorFor('notice');
    });

    // TODO #39 - Fix includeProperties for nested properties
    // it('should only validate specific collection property', () => {
    //   const orderValidator = createValidator<Order>(val => {
    //     val.ruleFor('total').greaterThan(0);
    //     val.ruleFor('amount').greaterThan(0);
    //   });
    //   personValidator.ruleFor('name').notEmpty();
    //   personValidator.ruleForEach('orders').setValidator(orderValidator);

    //   const result = testValidate(
    //     personValidator,
    //     createPersonWith({
    //       name: '',
    //       orders: [
    //         createOrderWith({
    //           total: 0,
    //           amount: 0
    //         }),
    //         createOrderWith(),
    //         createOrderWith({
    //           total: 0,
    //           amount: 0
    //         })
    //       ]
    //     }),
    //     strategy => strategy.includeProperties(p => p.orders[0].total)
    //   );
    //   expect(result.isValid).toBe(false);
    // });

    // it('should only validate specific nested property', () => {
    //   const addressValidator = createValidator<Address>(val => {
    //     val.ruleFor('city').notEmpty();
    //     val.ruleFor('state').notEmpty();
    //   });
    //   personValidator.ruleFor('name').notEmpty();
    //   personValidator.ruleFor('address').setValidator(addressValidator);

    //   const result = testValidate(
    //     personValidator,
    //     createPersonWith({
    //       name: '',
    //       address: createAddressWith({
    //         city: '',
    //         state: ''
    //       })
    //     }),
    //     strategy => strategy.includeProperties(p => p.address.city)
    //   );
    //   expect(result.isValid).toBe(false);
    // });

    it('should validate single property specified by expression', () => {
      personValidator.ruleFor('name').notEmpty();
      personValidator.ruleFor('age').greaterThanOrEqualTo(18);

      const result = testValidate(
        personValidator,
        createPersonWith({
          name: '',
          age: 17
        }),
        strategy => strategy.includeProperties(p => p.name)
      );

      expect(result.isValid).toBe(false);
      result.shouldHaveValidationErrorFor('name');
      result.shouldNotHaveValidationErrorFor('age');
    });

    it('should validate multiple properties specified by expression', () => {
      personValidator.ruleFor('name').notEmpty();
      personValidator.ruleFor('age').greaterThanOrEqualTo(18);
      personValidator.ruleFor('notice').minLength(5);

      const result = testValidate(
        personValidator,
        createPersonWith({
          name: '',
          age: 17
        }),
        strategy => {
          strategy.includeProperties(
            p => p.name,
            p => p.age
          );
        }
      );

      expect(result.isValid).toBe(false);
      result.shouldHaveValidationErrorFor('name');
      result.shouldHaveValidationErrorFor('age');
      result.shouldNotHaveValidationErrorFor('notice');
    });
  });
});
