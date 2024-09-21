---
keyword: AsynchronousValidation
---

In some situations, you may wish to define asynchronous validations, for example when working with an external API. By default, `@ts-fluentvalidation/core` allows custom validations defined with `mustAsync()` to be run asynchronously, as well as defining asynchronous conditions with `whenAsync()` or `unlessAsync()`.

A simplistic solution that checks if a user ID is already in use using an external web API:

```typescript
const personValidator = createValidator<Person>().ruleFor(
  'name',
  mustAsync(async (name: string) => {
    const isValid = await fetch('<API_ENDPOINT>/check-name/' + name);
    return isValid;
  })
);
```

Invoking the validator is essentially the same, but you should now invoke it by calling `validateAsync()`:

```typescript
const validationResult = await personValidator.validateAsync(person);
```

> **Note**
> Calling `validateAsync()` will run both synchronous and asynchronous validations.

> **Warning**
> If your validator contains asynchronous validations or asynchronous conditions, it's important that you _always_ call `validateAsync()` on your validator and never `validate()`. If you call `validate()`, then a `AsyncValidatorInvokedSynchronouslyError` will be thrown.
