import { AbstractValidator } from './abstract-validator';
import { MemberExpression } from './models';
import { createPersonWith } from './testing/test-data';
import { Person } from './testing/test-models';
import { KeyOf } from './ts-helpers';
import { ValidationContext } from './validation-context';

class PersonValidator extends AbstractValidator<Person> {
  constructor() {
    super();
  }
}

const personValidator = new PersonValidator();

describe(AbstractValidator.name, () => {
  it('should return `isValid === true` if the value is valid', () => {
    personValidator.ruleFor(p => p.name).notEmpty();
    const result = personValidator.validate(createPersonWith());
    expect(result.isValid).toBeTruthy();
  });

  it('should return `isValid === false` if the value is invalid', () => {
    personValidator.ruleFor(p => p.name).notEmpty();
    const result = personValidator.validate(
      createPersonWith({
        name: ''
      })
    );
    expect(result.isValid).toBeFalsy();
  });

  it('should expose the failures via the `errors` property', () => {
    personValidator.ruleFor(p => p.name).notEmpty();
    const result = personValidator.validate(
      createPersonWith({
        name: ''
      })
    );
    expect(result.errors).toHaveLength(1);
  });

  it('should override the default error message using `withMessage`', () => {
    personValidator
      .ruleFor(p => p.name)
      .notEmpty()
      .withMessage('Name is required');
    const result = personValidator.validate(
      createPersonWith({
        name: ''
      })
    );
    expect(result.errors[0].message).toBe('Name is required');
  });

  it('should override the property name using `withName`', () => {
    personValidator
      .ruleFor(p => p.name)
      .notEmpty()
      .withName('Person Name');
    const result = personValidator.validate(
      createPersonWith({
        name: ''
      })
    );
    expect(result.errors[0].message).toBe('Person Name must not be empty.');
  });

  it("should be stateless (multiple `validate` calls won't produce duplicated failures)", () => {
    personValidator.ruleFor(p => p.name).notEmpty();
    const invalidPerson = createPersonWith({
      name: ''
    });
    personValidator.validate(invalidPerson);
    const result = personValidator.validate(invalidPerson);
    expect(result.errors).toHaveLength(1);
  });

  it('should throw `Invalid MemberExpression` error given an invalid member expression', () => {
    const memberExpression = ((p: Person) => p) as unknown as MemberExpression<Person, string>;
    const expressionString = memberExpression.toString();

    expect(() => {
      personValidator.ruleFor(memberExpression).notEmpty();
    }).toThrow(`Invalid MemberExpression: '${expressionString}'`);
  });

  it('should throw `Invalid member expression or property name` error given an invalid property name', () => {
    const invalidPropertyName = '';

    expect(() => {
      personValidator.ruleFor(invalidPropertyName as KeyOf<Person>).null();
    }).toThrow(`Invalid member expression or property name: ${invalidPropertyName.toString()}`);
  });

  it('should validate using validation context', () => {
    personValidator.ruleFor(p => p.name).notEmpty();
    const testContext: ValidationContext<Person> = new ValidationContext(createPersonWith({ name: '' }));
    const result = personValidator.validate(testContext);
    expect(result.isValid).toBeFalsy();
  });
});
