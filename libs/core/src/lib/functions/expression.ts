/**
 * Extracts the name of the property accessed by a property selector expression.
 * Uses a Proxy to intercept property access at runtime.
 *
 * @param expression - A function that selects a property from an instance, e.g. `x => x.name`.
 * @returns The name of the accessed property.
 */
export function getPropertyName<T>(expression: (instance: T) => unknown): string {
  let accessedProperty = "";

  const handler: ProxyHandler<Record<string, unknown>> = {
    get(_target, prop): unknown {
      if (typeof prop === 'symbol' || prop === 'valueOf' || prop === 'toString') {
        return (): number => 1;
      }

      accessedProperty = prop.toString();
      return new Proxy({} as Record<string, unknown>, handler);
    }
  };

  const proxy = new Proxy({} as Record<string, unknown>, handler) as T;

  try {
    expression(proxy);
  } catch {
    //
  }

  return accessedProperty;
}
