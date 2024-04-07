export interface Person {
  name: string;
  age: number;
  notice?: string;
  address: Address;
}

export interface Address {
  city: string;
  state: string;
  zip: string;
}

export interface Employee extends Person {
  department: string;
  jobTitle: string;
}