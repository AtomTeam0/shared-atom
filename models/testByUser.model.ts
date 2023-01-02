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
    versionKey: false,
    timestamps: { createdAt: false, updatedAt: false },
  }
);

// plugins
TestByUserSchema.plugin(populatePlugin<ITestByUser>, [
  { property: "user", ref: "users" },
  { property: "test", ref: "tests" },
  { property: "item", ref: "items" },
]);

export const TestByUserModel = mongoose.model<ITestByUser & mongoose.Document>(
  "testByUser",
  TestByUserSchema
);
