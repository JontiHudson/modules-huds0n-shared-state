import { Huds0nError } from '@huds0n/error';

export const UPDATE_ALL = Symbol('UPDATE_ALL');

export function toArray<E>(source: undefined | E | E[]): E[] {
  if (source === undefined) return [] as E[];
  return Array.isArray(source) ? source : [source];
}

export function deepClone<O extends object>(object: O): O {
  try {
    const objectCopy = {} as O;

    for (const key in object) {
      const value = object[key];

      if (Array.isArray(value)) {
        objectCopy[key] = Object.values(deepClone({ ...value })) as O[Extract<
          keyof O,
          string
        >];
      } else if (value?.constructor?.name === 'Object') {
        objectCopy[key] = deepClone(value);
      } else {
        objectCopy[key] = value;
      }
    }

    return objectCopy;
  } catch (error) {
    throw Huds0nError.create({
      code: 'DEEP_CLONE_ERROR',
      message: 'Unable to deep clone object',
      severity: 'ERROR',
      from: error,
    });
  }
}
