/**
 * Extracts the name of the property accessed by a property selector expression.
 * Uses a Proxy to intercept property access at runtime.
 *
 * @param expression - A function that selects a property from an instance, e.g. `x => x.name`.
 * @returns The name of the accessed property.
 */
export function getPropertyName<T>(expression: (instance: T) => unknown): string {
  let accessedProperty = "";

  const handler: ProxyHandler<any> = {
    get(target, prop) {
      if (typeof prop === 'symbol' || prop === 'valueOf' || prop === 'toString') {
        return () => 1;
      }

      accessedProperty = prop.toString();
      return new Proxy({}, handler);
    }
  };

  const proxy = new Proxy({} as any, handler);

  try {
    expression(proxy);
  } catch {
    //
  }

  return accessedProperty;
}
