# {{ NgDocPage.title }}

By default all defined rules will get executed but this can be customized be setting the cascading behavior either on validator or property level.

## Validator-Level cascading

Given the following validator implementation:

```typescript
const validator = createValidator<Person>();
validator.ruleFor(person => person.name).notEmpty();
validator.ruleFor(person => person.age).greaterThanOrEqualTo(18);
```

The validator will first validate the `name` property and regardless if the validation succeeds or fails the `age` validation will get executed because of the default value for `validatorLevelCascadeMode` being `Continue`. To ensure that the validation will stop on the first failed property validation you can pass the `CascadeMode` as part of the validators configuration:

```typescript
const validator = createValidator<Person>({
  validatorLevelCascadeMode: 'Stop'
});
validator.ruleFor(person => person.name).notEmpty();
validator.ruleFor(person => person.age).greaterThanOrEqualTo(18);
```

With this configuration the validator would stop after the `name` validation in case it fails. This can be called as a "fail fast" behavior.

## Property-Level cascading

In contrast to stop validation at validator level the cascading behavior can be set at property level too. Given the following validator implementation:

```typescript
const validator = createValidator<Person>();
validator
  .ruleFor(person => person.name)
  .notEmpty()
  .minLength(3);
```

The validator will first validate the `notEmpty` rule and regardless if the validation succeeds or fails the `minLength` rule will get executed because of the default value for `ruleLevelCascadeMode` being `Continue`. To ensure that the validation will stop on the first failed rule you can pass the `CascadeMode` as part of the chain:

```typescript
const validator = createValidator<Person>();
validator
  .ruleFor(person => person.name)
  .notEmpty()
  .minLength(3)
  .cascade('Stop');
```

With this configuration the validator would stop after the `notEmpty` rule in case it fails which would result in a maximum number of one failure. Because the cascading behavior as set at property level it doesn't matter if you call the `cascade` function at the beginning, in the middle or at the end of the rule chain.

> **Warning**
> Calling the `cascade` function multiple times on a rule chain will override any prior calls on the same chain.

### Per validator

The property-level cascading can be set per validator so you don't have to call the `cascade` function on every property:

```typescript
const validator = createValidator<Person>({
  ruleLevelCascadeMode: 'Stop'
});
validator
  .ruleFor(person => person.name)
  .notEmpty()
  .minLength(3);
```

This would result in having the `Stop` behavior on any property validations by default. Yo can still override it for specific property validation by calling the `cascade` function:

```typescript
const validator = createValidator<Person>({
  ruleLevelCascadeMode: 'Stop'
});
validator
  .ruleFor(person => person.name)
  .notEmpty()
  .minLength(3)
  .cascade('Continue');
```
