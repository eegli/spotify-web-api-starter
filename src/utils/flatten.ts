// Stolen and modified from https://gist.github.com/penguinboy/762197

export function flatten<T extends Record<string, any>>(
  object: T,
  path: string | null = null,
  separator = '_'
): T {
  return Object.keys(object).reduce((acc: T, key: string): T => {
    const value = object[key];
    const newPath = Array.isArray(object)
      ? `${path ? path : ''}[${key}]`
      : [path, key].filter(Boolean).join(separator);

    // Some keys should be preserved in their original structure (e.g.
    // available markets). If more properties should be ignored, they
    // can simply be added to the regex
    const ignore = /(genre|available_markets)/;

    if (ignore.test(key)) {
      return { ...acc, [newPath]: value };
    }

    const isObject = [
      typeof value === 'object',
      value !== null,
      !(value instanceof Date),
      !(value instanceof RegExp),
      !(Array.isArray(value) && value.length === 0),
    ].every(Boolean);

    return isObject
      ? { ...acc, ...flatten(value, newPath, separator) }
      : { ...acc, [newPath]: value };
  }, {} as T);
}
