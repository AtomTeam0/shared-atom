export const querySingleFunctionTypes = [
  "findOne",
  "findOneAndDelete",
  "findOneAndRemove",
  "findOneAndUpdate",
  "updateOne",
];

export const queryManyFunctionTypes = ["count", "find", "update", "updateMany"];

export const queryAllFunctionTypes = [
  ...querySingleFunctionTypes,
  ...queryManyFunctionTypes,
];
