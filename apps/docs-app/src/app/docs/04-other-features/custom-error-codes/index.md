

A custom error code can also be associated with validations by calling the `withErrorCode` function:

```typescript
export class PersonValidator extends AbstractValicator<Person> {
  constructor() {
    super();
    this.ruleFor(p => p.name)
      .notEmpty()
      .withErrorCode('ERR1234');
    this.ruleFor(p => p.age).greaterThanOrEqualTo(18);
  }
}
```

The resulting error code can be obtained from the `errorCode` property on the `ValidationFailure`:

```typescript
const personValidator = new PersonValidator();
const result = personValidator.validate({ name: '', age: 15 });
result.errors.forEach(failure => {
  console.log(`Property: ${failure.propertyName} - Error Code: ${failure.errorCode}`);
});
```

The output would be:

```bash
Property: name - Error Code: ERR1234
Property: age - Error Code: GreaterThanOrEqualRule
```

## ErrorCode and Error Messages

The `errorCode` is also used to determine the default error message for a particular validator. At a high level:

- The error code is used as the lookup key for an error message. For example, a `notNull()` validator has a default error code of `NotNullRule`, which used to look up the error messages from the `LanguageManager`. (see `*OtherFeaturesLocalization` page)
- If you provide an error code, you could also provide a localized message with the name of that error code to create a custom message.
- If you provide an error code but no custom message, the message will fall back to the default message for that validator. You're not required to add a custom message.
- Using `errorCode` can also be used to override the default error message. For example, if you use a custom `must()` validator, but you'd like to reuse the `notNull()` validator's default error message, you can call `withErrorCode("NotNullRule")` to achieve this result.
