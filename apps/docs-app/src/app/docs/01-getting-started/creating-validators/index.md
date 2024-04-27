# {{ NgDocPage.title }}

To define a validator for a model you can use either the `createValidator` function to create an inline validator:

```typescript group="createValidator" name="validator"
export const personValidator = createValidator<Person>();
```

```typescript group="createValidator" name="model"
export interface Person {
  name: string;
  age: number;
}
```

...or create a class inheriting from ` AbstractValidator` (`AbstractValidator<T>`) where `T` is the type of object you want to validate:

```typescript group="abstractValidator" name="validator"
export class PersonValidator extends AbstractValidator<Person> {}
```

```typescript group="abstractValidator" name="model"
export interface Person {
  name: string;
  age: number;
}
```

## Define rules

With the validator created you can start to define rules for the models properties. You can use either a member expression or a property name. The following example shows how to validate that the persons name should not be an empty string:

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
- `errors` - an array of `ValidationFailure` containing details about failed rule validations

The following code would log all errors to the console:

```typescript
const person: Person = {
  name: '',
  age: 0
};

const result: ValidationResult = personValidator.validate(person);

if (!result.isValid) {
  result.errors.forEach(error => console.error(`${error.propertyName} failed validation. Error was:`, error.message));
}
```

## Chaining rules

It's possible to assign multiple rules to an objects property using chaining:

```typescript
personValidator
  .ruleFor(p => p.name)
  .notEmpty()
  .notEqual('foo');
```

This would ensure that the name is not empty and is not equal to the string 'foo'.

## Complex properties

Validators can be re-used for complex properties. For example, imagine you have two models: Person and Address

```typescript
export interface Person {
  name: string;
  age: number;
  address: Address;
}

export interface Address {
  city: string;
  state: string;
  zip: string;
}
```

...and you define an AddressValidator:

```typescript
export class AddressValidator extends AbstractValidator<Address> {
  constructor() {
    super();
    this.ruleFor(a => a.city).notEmpty();
  }
}
```

...you can then re-use the AddressValidator in the PersonValidator definition:

```typescript
export class PersonValidator extends AbstractValidator<Person> {
  constructor() {
    super();
    this.ruleFor(p => p.name).notEmpty();
    this.ruleFor(p => p.address).setValidator(new AddressValidator());
  }
}
```

...so when you call `validate` on the PersonValidator it will run through the validator defined in both the PersonValidator and the AddressValidator and combine the results into a single ValidationResult.

If the child property is null or undefined, then the child validator will not be executed.

Instead of using a child validator, you can define child rules inline, e.g.:

```typescript
this.ruleFor(p => p.address.city).notEmpty();
```

In this case, a null check will _not_ be performed automatically on `Address`, so you should explicitly add a condition:

```typescript
this.ruleFor(p => p.address.city)
  .notEmpty()
  .when(p => !!p.address);
```

> **Note**
> Inline child rules will become available with the implementation of [#18 - Add support for inline child rules](https://github.com/bohoffi/ts-fluentvalidation/issues/18)

## Array properties

### Arrays of Simple Types

You can use the `ruleForEach` function to apply the same rule to multiple items in a collection:

```typescript
interface Person {
  addressLines: string[];
}
```

```typescript
class PersonValidator extends AbstractValidator<Person> {
  constructor() {
    super();
    this.ruleForEach(p => p.addressLines).notEmpty();
  }
}
```

The above validation will run a `notEmpty` check against each item in the `addressLines` array.

If you want to access the index of the collection element that caused the validation failure, you can use the special `{collectionIndex}` placeholder:

```typescript
class PersonValidator extends AbstractValidator<Person> {
  constructor() {
    super();
    this.ruleForEach(p => p.addressLines)
      .notEmpty()
      .withMessage('Address {collectionIndex} is required.');
  }
}
```

### Arrays of Complex Types

You can also combine `ruleForEach` with `setValidator` when the collection is of another complex objects. For example:

```typescript
interface Customer {
  orders: Orders[];
}

interface Order {
  total: number;
}
```

```typescript
class OrderValidator extends AbstractValidator<Order> {
  constructor() {
    super();
    this.ruleFor(x => x.total).greaterThan(0);
  }
}

class CustomerValidator extends AbstractValidator<Customer> {
  constructor() {
    super();
    this.ruleForEach(x => x.orders).setValidator(new OrderValidator());
  }
}
```
