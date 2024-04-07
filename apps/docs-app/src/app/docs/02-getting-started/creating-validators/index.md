# {{ NgDocPage.title }}

To define a validator for a model you can use the `createValidator` function

```typescript group="createValidator" name="validator"
const personValidator = createValidator<Person>();
```

```typescript group="createValidator" name="model"
export interface Person {
  name: string;
  age: number;
}
```

## Define rules

With the validator created you can start to define rules for the models properties. You can use either a member expression or the property name. The following example shows how to validate that the persons name should not be an empty string:

```typescript
// using a member expression
personValidator.ruleFor(p => p.name).notEmpty();
// results in the same as using the property name
personValidator.ruleFor('name').notEmpty();
```

## Validation

To validate an object using a validator call the validators `validate` function passing the object as the parameter:

```typescript
const person: Person = {
  name: '',
  age: 0
};

const result: ValidationResult = personValidator.validate(person);
```

`ValidationResult` returned by the `validate` function exposes the following properties:

- `isValid` - a flag indicating the validation succeeded
- `failures` - an array of `ValidationFailure` containing details about failed rule validations

The following code would log all failures to the console:

```typescript
const person: Person = {
  name: '',
  age: 0
};

const result: ValidationResult = personValidator.validate(person);

if (!result.isValid) {
  result.failures.forEach(failure => console.error(`${failure.propertyName} failed validation. Error was:`, failure.message));
}
```

## Chaining rules

It's possible to assign multiple rules to an objects property using chaining:

```typescript
// Ensure a persons name is neither empty nor equals `foo`
personValidator
  .ruleFor(p => p.name)
  .notEmpty()
  .notEquals('foo');
```

## Object properties

### TBD

## Array properties

### TBD
