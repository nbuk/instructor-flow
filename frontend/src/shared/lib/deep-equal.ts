type DeepEqualOptions = {
  /**
   * Имена полей, которые нужно игнорировать на любом уровне вложенности
   */
  ignoreKeys?: string[] | Set<string>;

  /**
   * path: ['user', 'profile', 'updatedAt']
   */
  ignorePredicate?: (key: string, path: string[]) => boolean;
};

export function deepEqual(
  a: unknown,
  b: unknown,
  options: DeepEqualOptions = {},
  path: string[] = [],
): boolean {
  const ignoreKeys =
    options.ignoreKeys instanceof Set
      ? options.ignoreKeys
      : new Set(options.ignoreKeys);

  if (a === b) return true;

  // Date
  if (a instanceof Date && b instanceof Date) {
    return a.getTime() === b.getTime();
  }

  // null / primitive / different types
  if (
    typeof a !== 'object' ||
    typeof b !== 'object' ||
    a === null ||
    b === null
  ) {
    return false;
  }

  // Array
  if (Array.isArray(a) || Array.isArray(b)) {
    if (!Array.isArray(a) || !Array.isArray(b)) return false;
    if (a.length !== b.length) return false;

    for (let i = 0; i < a.length; i++) {
      if (!deepEqual(a[i], b[i], options, path)) return false;
    }

    return true;
  }

  // Object
  const objA = a as Record<string, unknown>;
  const objB = b as Record<string, unknown>;

  const keysA = Object.keys(objA).filter(
    (key) => !ignoreKeys.has(key) && !options.ignorePredicate?.(key, path),
  );

  const keysB = Object.keys(objB).filter(
    (key) => !ignoreKeys.has(key) && !options.ignorePredicate?.(key, path),
  );

  if (keysA.length !== keysB.length) return false;

  keysA.sort();
  keysB.sort();

  for (let i = 0; i < keysA.length; i++) {
    const key = keysA[i];
    if (key !== keysB[i]) return false;

    if (!deepEqual(objA[key], objB[key], options, [...path, key])) {
      return false;
    }
  }

  return true;
}
