import { faker } from '@faker-js/faker';

export interface Person {
  firstName: string;
  lastName: string;
  age: number;
  dateOfBirth: Date;
  address: Address;
  orders: Order[];
}

export interface Address {
  city: string;
  state: string;
  zip: string;
}

export interface Order {
  productName: string;
  amount: number;
}

export interface ObjectWithArray {
  name: string;
  scores: number[];
}

export function createPersonWith(overrides: Partial<Person> = {}): Person {
  return {
    firstName: faker.person.firstName(),
    lastName: faker.person.lastName(),
    age: faker.number.int({
      min: 1,
      max: 99
    }),
    dateOfBirth: faker.date.past(),
    address: createAddressWith(overrides.address),
    orders: faker.helpers.arrayElements([createOrderWith(), createOrderWith(), createOrderWith(), createOrderWith(), createOrderWith()], {
      min: 3,
      max: 5
    }),
    ...overrides
  };
}

export function createAddressWith(overrides: Partial<Address> = {}): Address {
  return {
    city: faker.location.city(),
    state: faker.location.state(),
    zip: faker.location.zipCode(),
    ...overrides
  };
}

export function createOrderWith(overrides: Partial<Order> = {}): Order {
  return {
    productName: faker.commerce.productName(),
    amount: faker.number.int({
      min: 1,
      max: 10
    }),
    ...overrides
  };
}
