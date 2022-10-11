import * as mongoose from "mongoose";

export function indexPlugin(
  schema: mongoose.Schema,
  options: {
    propertyNames: string[];
  }
) {
  const indexObj = Object.assign(
    {},
    ...options.propertyNames.map((property) => ({ [property]: "text" }))
  );
  const indexName = { name: `${options.propertyNames.join("-")}-text-index` };
  schema.index(indexObj, indexName);
}
