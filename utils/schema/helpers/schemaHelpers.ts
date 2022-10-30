export const preCreationFunctionType = "save";

export const preUpdateFunctionType = "findOneAndUpdate";

export const postGetSingleFunctionTypes = [
  "findOne",
  "findOneAndDelete",
  "findOneAndRemove",
  "findOneAndUpdate",
  "updateOne",
];

export const postGetManyFunctionTypes = ["count", "find", "update"];

export const postGetAllFunctionTypes = [
  ...postGetSingleFunctionTypes,
  ...postGetManyFunctionTypes,
];
