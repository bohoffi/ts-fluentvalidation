`@ts-fluentvalidation/core` is a TypeScript library for building strongly-typed human-readable validators without any further depedencies.
The goal is to create a TypeScript port of the .NET library FluentValidation with a nearly matching syntax and feature set.

## Features

- strongly-typed
- dependency-less
- reusable
- extensible

## Example

```typescript
interface Person {
    firstName: string;
    lastName: string;
    age: number;
}

const personValidator = createValidator<Person>()
  .ruleFor('firstName', notEmpty())
  .ruleFor('lastName', notEmpty())
  .ruleFor('age', greaterThanOrEquals(18));

const person: Person = {
    firstName: 'Foo',
    lastName: '',
    age: 35
};

const validationResult: ValidationResult = personValidator.validate(person);

if (!validationResult.isValid) {
    ...
}
```

## Credits

- [FluentValidation](https://docs.fluentvalidation.net/)
  - .NET validation using a fluent API
