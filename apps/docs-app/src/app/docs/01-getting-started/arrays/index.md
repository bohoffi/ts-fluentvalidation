---
keyword: Arrays
---

## Arrays of primitives

You can use the `ruleForEach` function to apply the same rule to multiple items in an array:

```typescript
interface Person {
  pets: string[];
}

const personValidator = createValidator<Person>().ruleForEach('pets', notEmpty());
```

The above validator will run the `notEmpty()` validation against each item in the `pets` array.

If one of the item validations fails the `propertyName` of the `ValidationFailure` will be extended with the items index - like `pets[2]`.
