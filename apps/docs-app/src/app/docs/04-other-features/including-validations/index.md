# {{ NgDocPage.title }}

You can include validations from other validators provided they validate the same type. This allows you to split validations across multiple validators and compose them together (in a similar way to how other languages support traits). For example, imagine you have 2 validators that validate different properties of a `Person`:

```typescript
export const personAgeValidator = createValidator<Person>().ruleFor('age', greaterThanOrEquals(18));

export const personNameValidator = createValidator<Person>().ruleFor('name', notNull());
```

Because both of these validators are targetting the same model type `Person`, you can combine them using the `include()` function:

```typescript
export const personValidator = createValidator<Person>().include(personAgeValidator).include(personNameValidator);
```

> **Note**
> You can only include validators that target the same type as the root validator.
