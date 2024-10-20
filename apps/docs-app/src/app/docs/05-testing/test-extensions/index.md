---
keyword: TestExtensions
---

`@ts-fluentvalidation/core` provides some extends that can aid with testing your validators.

We recommend treating validators as 'black boxes' - provide input to them and then assert whether the validation results are correct or incorrect.

## Using `testValidate`

You can use the `testValidate` function to invoke a validator for testing purposes, and then perform assertions against the result. This makes it easier to write tests for validators.

For example, imagine the following validator:

```typescript
const personValidator = createValidator<Person>().ruleFor('lastName', notEmpty());
```

You could ensure that this validator works correctly by writing the following tests:

```typescript
describe('personValidator', () => {
  it('should have error when lastName is empty', () => {
    const result = testValidate(personValidator, { lastName: '' });
    result.shouldHaveValidationErrorFor('lastName');
  });

  it('should not have error when lastName is not empty', () => {
    const result = testValidate(personValidator, { lastName: 'John' });
    result.shouldNotHaveValidationErrorFor('lastName');
  });
});
```

If the assertion fails, then a `TestValidationError` will be thrown.

If you have more complex tests, you can use the same technique to perform multiple assertions on a single validation result. For example:

```typescript
const result = testValidate(personValidator, { lastName: '' });

// Assert that there should be a failure for the lastName property
result.shouldHaveValidationErrorFor('lastName');

// Assert that there should be no failure for the age property
result.shouldNotHaveValidationErrorFor('age');

// Complex and Array properties can be checked too
// To check for a complex property
result.shouldHaveValidationErrorFor('address');
// To check a nested objects property
result.shouldHaveValidationErrorFor('address.city');
// To check for a specific array item
result.shouldHaveValidationErrorFor('orders[0]');
// To check a specific array item's property
result.shouldHaveValidationErrorFor('orders[0].amount');
```

You can also chain additional function calls to the result of `shouldHaveValidationErrorFor` that test individual components of the validation failure including the error message, error code, severity and custom state:

```typescript
const result = testValidate(personValidator, { lastName: '' });
result
  .shouldHaveValidationErrorFor('lastName')
  .withErrorMessage('Value must not be empty.')
  .withErrorCode('notEmpty')
  .withSeverity('Error');
```

## Asynchronous `testValidate`

There is also an asynchronous `testValidateAsync()` function available which corresponds to the regular `validateAsync()` function. Usage is similar, except the method returns a promise instead.
