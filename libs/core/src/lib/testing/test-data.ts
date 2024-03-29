import { faker } from '@faker-js/faker';
import { Address, Person } from './test-models';

export function createPersonWith(overrides: Partial<Person> = {}): Person {
  return {
    name: faker.person.fullName(),
    age: faker.number.int({
      min: 18,
      max: 65
    }),
    address: createAddressWith(overrides.address),
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
