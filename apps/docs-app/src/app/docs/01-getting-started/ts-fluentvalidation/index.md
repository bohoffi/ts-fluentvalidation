# {{ NgDocPage.title }}

`@ts-fluentvalidation/core` is a TypeScript library for building strongly-typed human-readable validators without any further depedencies.
The goal is to create a TypeScript port of the .NET library FluentValidation including a matching syntax.

## Features

- strongly-typed
- dependency-less
- reusable
- extensible

## Roadmap

- [ ] custom rules (beyond `.must` including placeholder support)
- [ ] async validation
- further items can be looked up [here](https://github.com/bohoffi/ts-fluentvalidation/issues?q=is%3Aopen+is%3Aissue+label%3A%22area%3A+core%22)

## Example

```typescript
interface Person {
    firstName: string;
    lastName: string;
    age: number;
    addressLines: string[];
}

const personValidator = createValidator<Person>();
personValidator.ruleFor(p => p.firstName).notEmpty();
personValidator.ruleFor(p => p.lastName).notEmpty();
personValidator.ruleFor(p => p.age).greaterThanOrEqualTo(18);
personValidator.ruleForEach(p => p.addressLines).notEmpty();

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
