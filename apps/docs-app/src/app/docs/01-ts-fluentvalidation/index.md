# {{ NgDocPage.title }}

`@ts-fluentvalidation/core` is a TypeScript library for building strongly-typed human-readable validators without any further depedencies. The goal is to create a TypeScript port of the .NET library FluentValidation.

## Features

- strongly-typed
- dependency-less
- reusable
- extensible

## Roadmap

- object rules (child validators)
- array validations
- custom rules (beyond `.must` including placeholder support)
- async validation
- severity level

## Example

```typescript
interface Person {
    firstName: string;
    lastName: string;
    age: number;
}

const personValidator = createValidator<Person>();
personValidator.ruleFor(p => p.firstName).notEmpty();
personValidator.ruleFor(p => p.lastName).notEmpty();
personValidator.ruleFor(p => p.age).greaterThanOrEqualTo(18);

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
  - template for this port
- [fluentvalidation-ts](https://github.com/AlexJPotter/fluentvalidation-ts)
  - a powerfull TypeScript variant of FluentValidation with a slightly different API
  - a big influencer when it comes to the implementation
