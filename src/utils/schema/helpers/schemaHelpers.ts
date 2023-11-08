import {QueryWithHelpers} from "mongoose";

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

type SchemaMethods<T> = {
  [methodName: string]: (options?: any) => QueryWithHelpers<Array<T>, T>;
};

export const paginationWrapper = async <T>(
    skip: number,
    limit: number,
    query: <TMethods>(params: {}) => SchemaMethods<T>,
    params: any
) => {
  return query(params).skip(skip).limit(limit);
};
