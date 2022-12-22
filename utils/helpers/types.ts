type DeepKey<T> = {
  [K in keyof T]: T[K] extends object ? DeepKey<T[K]> : K;
};

type DeepKeyString<T> = {
  [K in keyof DeepKey<T>]: string;
}[keyof DeepKey<T>];

export type PorpertyOptionalDeep<T> = Extract<DeepKeyString<T>, string>;

export function propertyValGetter<T>(
  doc: any,
  property: PorpertyOptionalDeep<T>
) {
  if (property.toString().includes(".")) {
    const fatherProperty = property.toString().split(".")[0];
    const childProperty = property.toString().split(".")[1];
    return doc[fatherProperty][childProperty];
  }
  return doc[property];
}

export function propertyValSetter<T>(
  doc: any,
  property: PorpertyOptionalDeep<T>,
  newVal: any
) {
  if (property.toString().includes(".")) {
    const fatherProperty = property.toString().split(".")[0];
    const childProperty = property.toString().split(".")[1];
    return {
      ...doc,
      [fatherProperty]: {
        ...doc[fatherProperty],
        [childProperty]: newVal,
      },
    };
  }
  return { ...doc, [property]: newVal };
}
