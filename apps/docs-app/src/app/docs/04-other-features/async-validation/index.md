# {{ NgDocPage.title }}

In some situations, you may wish to define asynchronous rules, for example when working with an external API. By default, `@ts-fluentvalidation/core` allows custom rules defined with `mustAsync` to be run asynchronously.

A simplistic solution that checks if a user ID is already in use using an external API:

```typescript
class CustomerValidator extends AbstractValidator<Customer> {
  constructor() {
    super();

    this.ruleFor(c => c.id)
      .mustAsync(async (id: number) => {
        const exists = await fetch('<API_ENDPOINT>/id/check' + id);
        return !exists;
      })
      .withMessage('ID must be unique');
  }
}
```

Invoking the validator is essentially the same, but you should now invoke it by calling `validateAsync`;

```typescript
const validator = new CustomerValidator();
const result = await validator.validateAsync(customer);
```

> **Note**
> Calling `validateAsync` will run both synchronous and asynchronous rules.

> **Warning**
> If your validator contains asynchronous validations, it's important that you _always_ call `validateAsync` on your validator and never `validate`. If you call `validate`, then an error will be thrown.

> **Note**
> Async conditions will become available with the implementation of [#31 - Async conditions](https://github.com/bohoffi/ts-fluentvalidation/issues/31)
