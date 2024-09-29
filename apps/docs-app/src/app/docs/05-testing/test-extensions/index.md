---
keyword: TestExtensions
---

`@ts-fluentvalidation/core` provides some extends that can aid with testing your validators.

We recommend treating validators as 'black boxes' - provide input to them and then assert whether the validation results are correct or incorrect.

## Using `testValidate`

You can use the `testValidate` function to invoke a validator for testing purposes, and then perform assertions against the result. This makes it easier to write tests for validators.

For example, imagine the following validator:

```typescript
const personValidator = createValidator<Person>().ruleFor('name', notEmpty());
```

You could ensure that this validator works correctly by writing the following tests:

```typescript
describe('personValidator', () => {
  it('should have error when name is empty', () => {
    const result = testValidate(personValidator, { name: '' });
    result.shouldHaveValidationErrorFor('name');
  });

  it('should not have error when name is not empty', () => {
    const result = testValidate(personValidator, { name: 'John' });
    result.shouldNotHaveValidationErrorFor('name');
  });
});
```

If the assertion fails, then a `TestValidationError` will be thrown.

If you have more complex tests, you can use the same technique to perform multiple assertions on a single validation result. For example:

```typescript
const result = testValidate(personValidator, { name: '' });

// Assert that there should be a failure for the name property
result.shouldHaveValidationErrorFor('name');

// Assert that there should be no failure for the age property
result.shouldNotHaveValidationErrorFor('age');

// You can also use an array propertys key with an index to check for a specific array item
result.shouldHaveValidationErrorFor('pets[0]');
```

You can also chain additional function calls to the result of `shouldHaveValidationErrorFor` that test individual components of the validation failure including the error message and severity:

```typescript
const result = testValidate(personValidator, { name: '' });
result.shouldHaveValidationErrorFor('name').withErrorMessage('Value must not be empty.').withSeverity('Error');
```

## Asynchronous `testValidate`

There is also an asynchronous `testValidateAsync` function available which corresponds to the regular `validateAsync` function. Usage is similar, except the method returns a promise instead.
