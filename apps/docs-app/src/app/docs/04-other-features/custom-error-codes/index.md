---
keyword: CustomErrorCodes
---

A custom error code can be associated with the validation by calling `withErrorCode()` function:

```typescript
const personValidator = createValidator<Person>().ruleFor('lastName', notEmpty().withErrorCode('ERR123')).ruleFor('firstName', notEmpty());
```

The resulting error code can be obtained from the `errorCode` property on the `ValidationFailure`:

```typescript
const result = personValidator.validate({ lastName: '', firstName: '' });

result.failures.forEach(failure => console.log(`Property: ${failure.propertyName} Error Code: ${failure.errorCode}`));
```

The output would be:

```shell
Property: lastName Error Code: ERR123
Property: firstName Error Code: notEmpty
```
