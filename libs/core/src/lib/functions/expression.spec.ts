import { getPropertyName } from './expression';

interface TestModel {
  name: string;
  age: number;
  address: {
    city: string;
  };
}

describe(getPropertyName.name, () => {
  it('should return the property name for a string property', () => {
    expect(getPropertyName<TestModel>(x => x.name)).toBe('name');
  });

  it('should return the property name for a number property', () => {
    expect(getPropertyName<TestModel>(x => x.age)).toBe('age');
  });

  it('should return the top-level property name for a nested accessor', () => {
    expect(getPropertyName<TestModel>(x => x.address)).toBe('address');
  });
});

