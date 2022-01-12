import Error from "@huds0n/error";

export const UPDATE_ALL = Symbol("UPDATE_ALL");

export function toArray<E>(source: undefined | E | E[]): E[] {
  if (source === undefined) return [] as E[];
  return Array.isArray(source) ? source : [source];
}

export function deepClone<O extends Object>(object: O): O {
  try {
    const objectCopy = {};

    for (const key in object) {
      const value = object[key];

      if (Array.isArray(value)) {
        // @ts-ignore
        objectCopy[key] = Object.values(deepClone({ ...value }));
        // @ts-ignore
      } else if (value?.constructor?.name === "Object") {
        // @ts-ignore
        objectCopy[key] = deepClone(value);
      } else {
        // @ts-ignore
        objectCopy[key] = value;
      }
    }

    // @ts-ignore
    return objectCopy;
  } catch (error) {
    throw Error.transform(error, {
      code: "DEEP_CLONE_ERROR",
      message: "Unable to deep clone object",
      severity: "HIGH",
    });
  }
}
