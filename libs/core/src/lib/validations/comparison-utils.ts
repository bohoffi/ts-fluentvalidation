/**
 * Extracts the property name accessed by a simple property accessor lambda.
 * e.g. `model => model.forename` → `"forename"`
 *
 * Returns `undefined` for non-trivial expressions.
 */
export function extractPropertyName(fn: (model: never) => unknown): string | undefined {
  const match = fn.toString().match(/(?:=>|return)\s*\w+\.(\w+)/);
  return match?.[1];
}
