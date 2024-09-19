

`@ts-fluentvalidation/core` provides some extensions that can aid with testing you validators.

We recommend treating validators as ‘black boxes’ - provide input to them and then assert whether the validation results are correct or incorrect.

## Using testValidate

You can use the `testValidate` function to invoke a validator for testing purposes, and then perform assertions against the result. This makes it easier to write tests for validators.

> **Note**
> The following section describes the synchronous usage. The asynchonous version uses `testValidateAsync` and returns a `Promise<TestValidationResult>`.

For example, imagine the following validator is defined:

```typescript
export class PersonValidator extends AbstractValidator<Person> {
  constructor() {
    super();
    this.ruleFor(p => p.name).notEmpty();
  }
}
```

You could ensure that this validator works correctly by writing the following test (using Jest):

```typescript
import { PersonValidator } from './person-validator';
import { testValidate } from '@ts-fluentvalidation/core/testing';

describe(PersonValidator.name, () => {
  let validator: PersonValidator;

  beforeEach(() => {
    validator = new PersonValidator();
  });

  it('should have an error when the name is empty', () => {
    const person: Person = {
      name: ''
    };
    const result: TestValidationResult<Person> = testValidate(validator, person);
    result.shouldHaveValidationErrorFor(p => p.name);
  });

  it('should have no error when the name is specified', () => {
    const person: Person = {
      name: 'John'
    };
    const result = testValidate(validator, person);
    result.shouldNotHaveValidationErrorFor(p => p.name);
  });
});
```

If the assertion fails, then a `TestValidationError` will be thrown.

If you have more complex tests, you can use the same technique to perform multiple assertions on a single validation result:

```typescript
const result = testValidate(personValidator, person);

// Asserts that there should be a failure for the name property
result.shouldHaveValidationErrorFor(p => p.name);

// Asserts that there should be a failure for the age property
result.shouldHaveValidationErrorFor(p => p.age);

// You can also use a string value for properties that cannot be easily represented with an expression
result.shouldHaveValidationErrorFor('pets[1]');
```

Besides checking for the pure existance of a validation failure you can extend the assertion like:

```typescript
result
  .shouldHaveValidationErrorFor(p => p.name)
  .withMessage('name should not be empty.')
  .withSeverity('Error')
  .withErrorCode('NotEmptyRule');
```

As there can be multiple failures for a single property these assertions check all failures if there is more than one. If no matching failure can be found a `TestValidationError` will be thrown.
