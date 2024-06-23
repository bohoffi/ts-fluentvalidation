import { faker } from '@faker-js/faker';
import { Address, Company, Employee, Order, Person } from './test-models';

export function createPersonWith(overrides: Partial<Person> = {}): Person {
  return {
    name: faker.person.fullName(),
    age: faker.number.int({
      min: 18,
      max: 65
    }),
    address: createAddressWith(overrides.address),
    pets: [],
    orders: [],
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
    total: faker.number.int({
      min: 1,
      max: 1000
    }),
    amount: faker.number.int({
      min: 1,
      max: 10
    }),
    ...overrides
  };
}

export function createCompanyWith(overrides: Partial<Company> = {}): Company {
  return {
    name: faker.company.name(),
    employees: faker.helpers.arrayElements([createEmployeeWith(), createEmployeeWith(), createEmployeeWith()]),
    ...overrides
  };
}

export function createEmployeeWith(overrides: Partial<Employee> = {}): Employee {
  return {
    ...createPersonWith(overrides),
    department: faker.company.name(),
    jobTitle: faker.person.jobTitle(),
    areas: faker.helpers.arrayElements([faker.person.jobArea(), faker.person.jobArea(), faker.person.jobArea(), faker.person.jobArea()]),
    ...overrides
  };
}
