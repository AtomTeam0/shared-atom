import {Document, Model} from "mongoose";

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

export const paginationWrapper = async <T extends Model<Document>>(
    skip: number,
    limit: number,
    model: T,
    params: any
) => {
  console.log("---------------------------------->>>>>>>>>>", model, typeof model)
  return model.find(params).skip(skip).limit(limit);
};
