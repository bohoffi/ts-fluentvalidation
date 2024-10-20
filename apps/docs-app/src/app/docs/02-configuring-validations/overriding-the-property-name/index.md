---
keyword: OverridingThePropertyName
---

The default validation error messages contain the property name being validated. For examplem if you were to defined a validator like this:

```typescript
const personValidator = createValidator<Person>().ruleFor('lastName', notEmpty());
```

...then the default error message would be _'lastName' must not be empty._. Although you can override the entire error message by using the `withMessage()` function, you can also replace just the property name by using the `withName()` function:

```typescript
const personValidator = createValidator<Person>().ruleFor('lastName', notEmpty().withName('Last name'));
```

Now the error message would be _'Last name' must not be empty._.

`withName()` is also supported for validations passed into `ruleForEach()` and `setValidator()`/`setValidatorAsync()`.

> **Note**
> Note that this only replaces the name of the property in the error message. When you inspect the `failures` array of `ValidationResult`, this error will still be associated with a property called `lastName`.

## Really overriding the Property Name

Calling `withName()` on every single validation for a specific key is tedious and error prone.

If you want to set the override only once for all validations contained in a `ruleFor()` call you can use the `overridePropertyName()` function like:

```typescript
const validator = createValidator<Person>().ruleFor('lastName', equals('John').overridePropertyName('Last name'), notEmpty());
```

This will override the property name for both `equals()` and `notEmpty()`.

> **Note**
> Be aware that this would also associate the overridden value with the validations failures (`ValidationFailure.propertyName`).

`overridePropertyName()` is also supported for validations passed into `ruleForEach()` and `setValidator()`/`setValidatorAsync()`.
