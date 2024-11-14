The `Validator.when` and `Validator.unless` functions can be used to specify conditions that control when the validation should be executed. For example, this validation on the `lastName` property will only get executed when `age` is greater then or equal to `18`:

```typescript
validator.ruleFor(
  'lastName',
  notNull().when(person => person.age >= 18)
);
```

The `unless` function acts the opposite of `when`.

By default `@ts-fluentvalidation/core` will apply conditions to all preceding validations of the same validation chain of a `ruleFor` call:

```typescript
validator.ruleFor(
  'lastName',
  notNull(),
  notEmpty().when(person => person.age >= 18)
);
```

...will execute neither the `notNull` nor the `notEmpty` validation if the persons age is below 18.

If you want to specify a condition to one specific validation you can do so by passing the second parameter `applyConditionTo`:

```typescript
validator.ruleFor(
  'lastName',
  notNull(),
  notEmpty().when(person => person.age >= 18, 'CurrentValidator')
);
```

...will always execute the `notNull` validation while the `notEmpty` validation execution is bound to the condition.

> **Note**
> The validations offer async versions of `when()` and `unless()`.

If you need to specify the same condition for multiple validations then you can call the top-level `Validator.when` (or `Validator.unless`) function instead of chaining the `when()` (or `unless()`) function at the end of each validation:

```typescript
validator.when(person => person.age >= 18, validator.ruleFor('firstname', notEmpty()).ruleFor('lastname', notEmpty()));
```

> **Note**
> Calling top-level `when()` (or `unless()`) function will return a `OtherwisableValidator`.

This time the condition will be applied to both rules. You can also chain a call to `OtherwisableValidator.otherwise` which will invoke rules that don't match the condition (an inversed condition will be set to these rules):

```typescript
validator
  .when(
    person => person.age >= 18,
    validator => validator.ruleFor('firstname', notEmpty()).ruleFor('lastname', notEmpty())
  )
  .otherwise(validator => validator.ruleFor('firstname', minLength(3)));
```

> **Note**
> The validator offers async versions of `when()` and `unless()`.
