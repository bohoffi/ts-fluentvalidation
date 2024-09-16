export interface Person {
  name: string;
  age: number;
  notice?: string;
  address: Address;
  pets: string[];
  orders: Order[];
  registred: boolean;
}

export interface Address {
  city: string;
  state: string;
  zip: string;
}

export interface Order {
  total: number;
  amount: number;
}

export interface Company {
  name: string;
  employees: Employee[];
}

export interface Employee extends Person {
  department: string;
  jobTitle: string;
  areas: string[];
}
