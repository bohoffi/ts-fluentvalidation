

By default all defined validations will get executed but this can be customized by setting the cascading behavior either on validator or property level.

## Validator-Level cascading

Given the following validator implementation:

```typescript
const validator = createValidator<Person>().ruleFor('name', notEmpty()).ruleFor('age', greaterThanOrEqualTo(18));
```

The validator will first validate the `name` property and regardless if the validation succeeds or fails the `age` validation will get executed because of the default value for `cascadeMode` being `Continue`. To ensure that the validation will stop on the first failed property validation you can pass the `CascadeMode` as part of the validators configuration:

```typescript
const validator = createValidator<Person>({
  cascadeMode: 'Stop'
})
  .ruleFor('name', notEmpty())
  .ruleFor('age', greaterThanOrEqualTo(18));
```

With this configuration the validator would stop after the `name` validation in case it fails. This can be called as a "fail fast" behavior.

## Property-Level cascading

In addition to stop validation at validator level the cascading behavior can be set at property level too. Given the following validator implementation:

```typescript
const validator = createValidator<Person>().ruleFor('name', notEmpty(), minLength(3));
```

The validator will first validate the `notEmpty` validation and regardless if the validation succeeds or fails the `minLength` validation will get executed because of the default value for `cascadeMode` being `Continue`. To ensure that the validation will stop on the first failed validation you can pass the `CascadeMode` as the second parameter of `ruleFor`:

```typescript
const validator = createValidator<Person>().ruleFor('name', 'Stop', notEmpty(), minLength(3));
```

With this configuration the validator would stop after the `notEmpty` validation in case it fails which would result in a maximum number of one failure.

### Per validator

The property-level cascading can be set per validator so you don't have to call the `cascade` function on every property:

```typescript
const validator = createValidator<Person>({
  propertyCascadeMode: 'Stop'
});
  .ruleFor('name', notEmpty(), minLength(3));
```

This would result in having the `Stop` behavior on any property validations by default. Yo can still override it for specific property validation by passing the `cascade` parameter:

```typescript
const validator = createValidator<Person>({
  ruleLevelCascadeMode: 'Stop'
}).ruleFor('name', 'Continue', notEmpty(), minLength(3));
```
