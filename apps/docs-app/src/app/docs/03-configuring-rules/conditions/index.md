

The `when` and `unless` functions can be used to specify conditions that control when the validation should be executed. For example, this validation on the `name` property will only get executed when `age` is greater then or equal to `18`:

```typescript
validator.ruleFor(
  'name',
  notNull().when(person => person.age >= 18)
);
```

The `unless` function acts the opposite of `when`.

By default `@ts-fluentvalidation/core` will apply conditions to all preceding validations of the same validation chain of a `ruleFor` call:

```typescript
validator.ruleFor(
  'name',
  notNull(),
  notEmpty().when(person => person.age >= 18)
);
```

...will execute neither the `notNull` nor the `notEmpty` validation if the persons age is below 18.

If you want to specify a condition to one specific validation you can do so by passing the second parameter `applyConditionTo`:

```typescript
validator.ruleFor(
  'name',
  notNull(),
  notEmpty().when(person => person.age >= 18, 'CurrentValidator')
);
```

...will always execute the `notNull` validation while the `notEmpty` validation execution is bound to the condition.
