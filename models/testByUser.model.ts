import * as mongoose from "mongoose";
import { ITestByUser } from "../common/interfaces/testByUser.interface";
import { populatePlugin } from "../utils/schema/plugins/populatePlugin";
import { ItemModel } from "./item.model";
import { TestModel } from "./test.model";
import { UserModel } from "./user.model";

const TestByUserSchema: mongoose.Schema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Types.ObjectId,
      required: true,
      ref: UserModel,
    },
    test: {
      type: mongoose.Types.ObjectId,
      required: true,
      ref: TestModel,
    },
    item: {
      type: mongoose.Types.ObjectId,
      required: true,
      ref: ItemModel,
    },
    grade: {
      type: Number,
      required: true,
    },
  },
  {
    toJSON: {
      virtuals: true,
      transform(_doc: any, ret: any): void {
        // eslint-disable-next-line no-param-reassign
        delete ret._id;
      },
    },
    versionKey: false,
    id: true,
    timestamps: { createdAt: false, updatedAt: false },
  }
);

// plugins
TestByUserSchema.plugin(populatePlugin, [
  { path: "user", ref: "users" },
  { path: "test", ref: "tests" },
  { path: "item", ref: "items" },
]);

export const TestByUserModel = mongoose.model<ITestByUser & mongoose.Document>(
  "testByUser",
  TestByUserSchema
);
