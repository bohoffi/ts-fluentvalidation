---
keyword: Arrays
---

## Arrays of primitives

You can use the `ruleForEach` function to apply the same rule to multiple items in an array:

```typescript
interface Person {
  pets: string[];
}

const personValidator = createValidator<Person>().ruleForEach('pets', notEmpty());
```

The above validator will run the `notEmpty()` validation against each item in the `pets` array.

If one of the item validations fails the `propertyName` of the `ValidationFailure` will be extended with the items index - like `pets[2]`.

## Array of Complex Types

### Using `must()` / `mustAsync()`

You can combine `ruleForEach()` with `must()` / `mustAsync()` when you want to create a validation for a property nested in an array item:

```typescript
export interface Person {
  orders: Order[];
}

export interface Order {
  amount: number;
}
```

```typescript
const personValidator = createValidator<Person>().ruleForEach(
  'orders',
  must(order => order.amount > 0, 'Amount must be positive.')
);
```

Given the above validator and running the following validation:

```typescript
const result = personValidator.validate({
  orders: [
    {
      amount: 10
    },
    {
      amount: 0
    }
  ]
});
```

...will result with 1 failure for the second order:

```typescript
{
  propertyName: 'orders[1]',
  message: 'Amount must be positive.',
  attemptedValue: 0,
  severity: 'Error'
}
```

### Using `setValidator`

Reusing the models from above:

```typescript
export interface Person {
  orders: Order[];
}

export interface Order {
  amount: number;
}
```

You can create a dedicated validator for the Address type and assign it using the `setValidator()` function like:

```typescript
const orderValidator = createValidator<Order>().ruleFor('amount', greaterThan(0));

const validator = createValidator<Person>().ruleForEach('orders', setValidator(orderValidator));
```
