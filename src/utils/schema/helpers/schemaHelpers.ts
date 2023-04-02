export const aggregationType = ["aggregate"];

export const creationFunctionType = ["save"];

export const updateFunctionType = ["findOneAndUpdate"];

export const getManyFunctionTypes = ["count", "find", "update"];

export const getSingleFunctionTypes = [
  "findOne",
  "findOneAndDelete",
  "findOneAndRemove",
  "findOneAndUpdate",
  "updateOne",
];

export const getAllFunctionTypes = [
  ...getManyFunctionTypes,
  ...getSingleFunctionTypes,
];
