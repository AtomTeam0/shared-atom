import * as mongoose from "mongoose";

export function indexPlugin<T>(
  schema: mongoose.Schema,
  options: {
    properties: Array<keyof T>;
  }
) {
  const indexObj = Object.assign(
    {},
    ...options.properties.map((property) => ({ [property]: "text" }))
  );
  const indexName = { name: `${options.properties.join("-")}-text-index` };
  schema.index(indexObj, indexName);
}
