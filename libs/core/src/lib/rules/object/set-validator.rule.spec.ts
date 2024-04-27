import { SetValidatorRule } from './set-validator.rule';
import { createValidator } from '../../create-validator';
import { Address, Person } from '../../testing/test-models';
import { createAddressWith, createPersonWith } from '../../testing/test-data';

describe(SetValidatorRule.name, () => {
  const addressValidator = createValidator<Address>(val => {
    val.ruleFor('city').notEmpty();
    val.ruleFor('state').notEmpty();
    val.ruleFor('zip').notEmpty();
  });
  const personValidator = createValidator<Person>(val => {
    val.ruleFor(p => p.address).setValidator(addressValidator);
  });

  it('should not return an error if the value is valid', () => {
    const person = createPersonWith({
      address: createAddressWith({ city: 'city', state: 'state', zip: 'zip' })
    });
    const result = personValidator.validate(person);
    expect(result.isValid).toBeTruthy();
    expect(result.errors).toHaveLength(0);
  });

  it('should not return an error if the value nullish', () => {
    const person = createPersonWith({
      address: null as unknown as Address
    });
    const result = personValidator.validate(person);
    expect(result.isValid).toBeTruthy();
    expect(result.errors).toHaveLength(0);
  });

  it('should return an error if the value is not valid', () => {
    const person = createPersonWith({
      address: createAddressWith({ city: '', state: 'state', zip: 'zip' })
    });
    const result = personValidator.validate(person);
    expect(result.isValid).toBeFalsy();
    expect(result.errors).toHaveLength(1);
    expect(result.errors[0].propertyName).toBe('address.city');
    expect(result.errors[0].message).toBe('city must not be empty.');
  });
});
