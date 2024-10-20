---
keyword: CustomState
---

There my be an occasion where you'd like to return contextual information about the state of your validation when it was run. The `withState()` function allows you to associate any custom data with the validation.

This is how you'd add custom state data to a validation:

```typescript
const personValidator = createValidator<Person>().ruleFor('firstName', notEmpty()).ruleFor('lastName', notEmpty().withState(1234));
```

This state will then be available via the `customState` property of the `ValidationFailure`:

```typescript
const result = personValidator.validate({ firstName: '', lastName: '' });

result.failures.forEach(failure => console.log(`Property: ${failure.propertyName} State: ${failure.customState}`));
```

The output would be:

```shell
Property: firstName State:
Property: lastName State: 1234
```
