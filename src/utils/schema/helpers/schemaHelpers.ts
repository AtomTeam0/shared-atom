export const aggregationType = ["aggregate"];

export const creationFunctionType = ["save", "create"];

export const updateFunctionType = ["findOneAndUpdate"];

export const getManyFunctionTypes = ["count", "find", "update"];

export const getSingleFunctionTypes = [
  "findOne",
  "findById",
  "findOneAndDelete",
  "findOneAndRemove",
  "findOneAndUpdate",
  "updateOne",
];

export const getAllFunctionTypes = [
  ...getManyFunctionTypes,
  ...getSingleFunctionTypes,
];