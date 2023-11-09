import {Callback, EnforceDocument, FilterQuery, QueryOptions, QueryWithHelpers} from "mongoose";

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

type Find1<T> = <T,TQueryHelpers = {}, TMethods = {}>(callback?: Callback<EnforceDocument<T, TMethods>[]>) => QueryWithHelpers<Array<EnforceDocument<T, TMethods>>, EnforceDocument<T, TMethods>, TQueryHelpers, T>;
type Find2<T> = <T,TQueryHelpers = {}, TMethods = {}>(filter: FilterQuery<T>, callback?: Callback<T[]>) => QueryWithHelpers<Array<EnforceDocument<T, TMethods>>, EnforceDocument<T, TMethods>, TQueryHelpers, T>;
type Find3<T> = <T,TQueryHelpers = {}, TMethods = {}>(filter: FilterQuery<T>, projection?: any | null, options?: QueryOptions | null, callback?: Callback<EnforceDocument<T, TMethods>[]>) => QueryWithHelpers<Array<EnforceDocument<T, TMethods>>, EnforceDocument<T, TMethods>, TQueryHelpers, T>;

type FindQuery<T> = Find1<T> | Find2<T> | Find3<T>;

export const paginationWrapper = async <T>(
    skip: number,
    limit: number,
    query: FindQuery<T>,
    params: any
) => {
  return query(params).skip(skip).limit(limit);
};
