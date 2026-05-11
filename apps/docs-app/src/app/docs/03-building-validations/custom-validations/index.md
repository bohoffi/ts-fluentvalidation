There are several ways to extend the ruleset beyond the built-in set. The easiest way is to make use of the `must()` function to write a custom validation function.

For these examples, we’ll imagine a scenario where you want to create a reusable validator that will ensure a string property does not start with a certain reference value.

## must()

The simplest way to implement a custom validation is by using the `must()` function.

Imagine we have the following model:

```typescript
export interface Person {
  lastName: string;
}
```

To ensure our last name property does not start with `John`, we could do this:

```typescript
const validator = createValidator<Person>().ruleFor(
  'lastName',
  must(lastName => !lastName.startsWith('John'), 'The last name shall not start with John.')
);
```

To make this logic reusable, we can extract it into a function:

```typescript
export function shouldNotStartWithJohn(value: string): boolean {
  return !value.startsWith('John');
}
```

We created a simple predicate function which can be used as the first parameter of `must()`:

```typescript
const validator = createValidator<Person>().ruleFor('lastName', must(shouldNotStartWithJohn, 'The last name shall not start with John.'));
```

So far so easy but even though the logic itself is reusable we are limited to a reference value of `John` and still have to repeat the validation message everytime we use the function.

### Model predicate overload

There is an additional overload for `must()` that also accepts the parent model as the second argument. This is useful when you want to compare the current property against another property on the same model:

```typescript
export interface Person {
  firstName: string;
  lastName: string;
}

const validator = createValidator<Person>().ruleFor(
  'lastName',
  must<string, Person>((lastName, person) => lastName !== person.firstName, 'Last name must differ from first name.')
);
```

Note that in this particular example, it would be better to use the cross-property version of `notEquals()`.

## Extensibility (Writing a Custom Validation)

If you want to increase reusability of validations you can wrap existing validations in functions. Let's reuse the example from above where a `string` property should not start with a certain reference value:

```typescript
// Create a reusable validation by wrapping the `must()` function
export function shouldNotStartWith<TModel>(referenceValue: string): SyncValidation<string, TModel> {
  return must((value: string) => !value.startsWith(referenceValue), `The value shall not start with ${referenceValue}.`);
}

const validator = createValidator<Person>().ruleFor('lastName', shouldNotStartWith('John'));
```
