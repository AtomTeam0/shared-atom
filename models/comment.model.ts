import * as mongoose from "mongoose";
import { IComment } from "../common/interfaces/comment.interface";
import { populatePlugin } from "../utils/schema/plugins/populatePlugin";
import { UserModel } from "./user.model";

const CommentSchema: mongoose.Schema = new mongoose.Schema(
  {
    comment: {
      type: String,
      required: true,
    },
    user: {
      type: mongoose.Types.ObjectId,
      required: true,
      ref: UserModel,
    },
  },
  {
    versionKey: false,
    timestamps: { createdAt: true, updatedAt: false },
  }
);

// plugins
CommentSchema.plugin(populatePlugin<IComment>, [
  { property: "user", ref: "user" },
]);

export const CommentModel = mongoose.model<IComment & mongoose.Document>(
  "comments",
  CommentSchema
);
