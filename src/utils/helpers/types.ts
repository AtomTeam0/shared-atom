type DeepKey<T> = {
  [K in keyof T]: T[K] extends object ? DeepKey<T[K]> : K;
};

type DeepKeyString<T> = {
  [K in keyof DeepKey<T>]: string;
}[keyof DeepKey<T>];

export type PorpertyOptionalDeep<T> = Extract<DeepKeyString<T>, string>;

// get a value from an object in a deep format
// example: propertyValGetter<Book>({book:{author:''}}, 'book.author')
export function propertyValGetter<T>(
  doc: any,
  property: PorpertyOptionalDeep<T>
) {
  if (property.toString().includes(".")) {
    const fatherProperty = property.toString().split(".")[0];
    const childProperty = property.toString().split(".")[1];
    return doc[fatherProperty] ? doc[fatherProperty][childProperty] : undefined;
  }
  return doc[property];
}

// sets a new value in an object in a deep format
// example: propertyValGetter<Book>({book:{author:''}}, 'book.author', 'Edan Ofer')
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
  return { [property]: newVal };
}
