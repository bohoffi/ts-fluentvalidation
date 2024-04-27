import { PropertyChain } from './property-chain';

describe('PropertyChain', () => {
  let chain: PropertyChain;

  beforeEach(() => {
    chain = new PropertyChain();
  });

  it('should construct a property chain from an array of member names', () => {
    const memberNames = ['foo', 'bar', 'baz'];
    const expected = 'foo.bar.baz';
    chain = new PropertyChain(memberNames);
    expect(chain.toString()).toBe(expected);
  });

  it('should construct a property chain from a parent chain', () => {
    const parentChain = new PropertyChain(['foo', 'bar']);
    const expected = 'foo.bar.baz';
    chain = new PropertyChain(parentChain);
    chain.add('baz');
    expect(chain.toString()).toBe(expected);
  });

  it('should ignore empty member names when constructing a property chain', () => {
    const memberNames = ['foo', '', 'bar', '', 'baz'] as string[];
    const expected = 'foo.bar.baz';
    chain = new PropertyChain(memberNames);
    expect(chain.toString()).toBe(expected);
  });

  it('should ignore undefined member names when constructing a property chain', () => {
    const memberNames = ['foo', undefined, 'bar', undefined, 'baz'] as string[];
    const expected = 'foo.bar.baz';
    chain = new PropertyChain(memberNames);
    expect(chain.toString()).toBe(expected);
  });

  it('should ignore null member names when constructing a property chain', () => {
    const memberNames = ['foo', null, 'bar', null, 'baz'] as string[];
    const expected = 'foo.bar.baz';
    chain = new PropertyChain(memberNames);
    expect(chain.toString()).toBe(expected);
  });

  it('construct string representation when calling `toString()`', () => {
    chain.add('foo');
    chain.add('bar');
    const expected = 'foo.bar';
    expect(chain.toString()).toBe(expected);
  });

  it('construct string representation with indexers when calling `toString()`', () => {
    chain.add('foo');
    chain.addIndexer('0');
    chain.add('bar');
    const expected = 'foo[0].bar';
    expect(chain.toString()).toBe(expected);
  });

  it('should throw when calling `addIndexer()` with an empty chain', () => {
    expect(() => chain.addIndexer('0')).toThrow('Could not apply an Indexer because the property chain is empty.');
  });

  it('should create from member expression when calling `fromExpression()`', () => {
    const expression = (obj: { foo: { bar: string } }) => obj.foo.bar;
    const expected = 'foo.bar';
    expect(PropertyChain.fromExpression(expression).toString()).toBe(expected);
  });

  it('should ignore empty property names when calling `add()`', () => {
    chain.add('');
    chain.add('foo');
    const expected = 'foo';
    expect(chain.toString()).toBe(expected);
  });

  it('construct string representation when calling `buildPropertyPath()`', () => {
    chain.add('foo');
    const expected = 'foo.bar';
    expect(chain.buildPropertyPath('bar')).toBe(expected);
  });
});
