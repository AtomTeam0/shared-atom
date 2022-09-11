import * as mongoose from "mongoose";

export const queryFunctionTypes = [
  "count",
  "find",
  "findOne",
  "findOneAndDelete",
  "findOneAndRemove",
  "findOneAndUpdate",
  "update",
  "updateOne",
  "updateMany",
];

export const populatePlugin = (
  properties: { path: string; ref: string }[],
  schema: mongoose.Schema
) => {
  const aggregateMiddleWare = schema.pre(
    "aggregate",
    async function (
      this: mongoose.Aggregate<any>,
      next: mongoose.HookNextFunction
    ) {
      properties.forEach((p) => {
        this.pipeline().unshift({
          $lookup: {
            from: p.ref,
            foreignField: "_id",
            localField: p.path,
            as: p.path,
          },
        });
      });
      next();
    }
  );

  const queryMiddleWares = queryFunctionTypes.map((type: string) =>
    schema.post(
      type,
      async function (
        this: mongoose.Query<any, any>,
        next: mongoose.HookNextFunction
      ) {
        this.populate(properties.map((p) => p.path));
        next();
      }
    )
  );

  return [aggregateMiddleWare, ...queryMiddleWares];
};
