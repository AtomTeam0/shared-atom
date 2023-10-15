import * as mongoose from "mongoose";
import { ITestByUser } from "common-atom/interfaces/testByUser.interface";
import { populatePlugin } from "../utils/schema/plugins/populatePlugin";

const TestByUserSchema: mongoose.Schema = new mongoose.Schema(
  {
    user: {
      type: String,
      required: true,
      ref: "users",
    },
    test: {
      type: mongoose.Types.ObjectId,
      required: true,
      ref: "tests",
    },
    item: {
      type: mongoose.Types.ObjectId,
      required: true,
      ref: "items",
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
  { property: "user", ref: "users", isTazId: true },
  { property: "test", ref: "tests" },
  { property: "item", ref: "items" },
]);

export const TestByUserModel = mongoose.model<ITestByUser & mongoose.Document>(
  "testByUser",
  TestByUserSchema
);
