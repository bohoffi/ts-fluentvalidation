---
keyword: 'ConfiguringRulesOverrideMessage'
---


A validations message can be ovewritten in two ways.

As a validations parameter - all built-in validations support a message as the last parameter:

```typescript
const validator = createValidator<Person>()
  .ruleFor('name', notEmpty('Name shall not be empty.'))
  .ruleFor('age', greaterThanOrEquals(18, 'The persons age must be at least 18.'));
```

Using the `withMessage` function of a `ValidationFn`.

```typescript
export function shouldNotStartWith<TModel>(referenceValue: string): ValidationFn<string, TModel> {
  return must((value: string) => !value.startsWith(referenceValue)).withMessage(`The value shall not start with ${referenceValue}.`);
}
```
