# {{ NgDocPage.title }}

The `when` and `unless` functions can be used to specify conditions that control when the rule should be executed. For example, this rule on the `name` property will only get executed when `age` is greater then or equal to `18`:

```typescript
validator
  .ruleFor(person => person.name)
  .isNotNull()
  .when(person => person.age >= 18);
```

The `unless` function acts the opposite of `when`.

By default `@ts-fluentvalidation/core` will apply conditions to all preceding rules of the same validation chain of a `ruleFor` call:

```typescript
validator
  .ruleFor(person => person.name)
  .isNotNull()
  .notEmpty()
  .when(person => person.age >= 18);
```

...will execute neither the `isNotNull` nor the `notEmpty` rule if the persons age is below 18.

If you want to specify a condition to one specific rule you can do so by passing the second parameter `applyConditionTo`:

```typescript
validator
  .ruleFor(person => person.name)
  .isNotNull()
  .notEmpty()
  .when(person => person.age >= 18, 'CurrentValidator');
```

...will always execute the `isNotNull` rule while the `notEmpty` rule execution is bound to the condition.
