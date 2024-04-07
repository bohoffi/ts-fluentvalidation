# {{ NgDocPage.title }}

Instead of writing the same rules for different validators over and over again you can create a function which provides a validator including predefined rules and extend it when needed. Given the following models:

```typescript
interface Person {
  name: string;
  age: number;
}

interface Employee extends Person {
  department: string;
}

interface Customer extends Person {
  customerNumber: string;
}
```

You could create your validators as follows:

```typescript
// create a base validator containing a predefined rule set
function createBaseValidator<T extends Person>() {
  return createValidator<T>(val => val.ruleFor(p => p.name).notEmpty());
}

// extends the base validator with specific rules
const employeeValidator = createBaseValidator<Employee>();
employeeValidator.ruleFor(p => p.department).notEmpty();

const customerValidator = createBaseValidator<Customer>();
customerValidator.ruleFor(p => p.customerNumber).notEmpty();
```
