import * as mongoose from "mongoose";
import { IComment } from "common-atom/interfaces/comment.interface";
import { populatePlugin } from "../utils/schema/plugins/populatePlugin";

const CommentSchema: mongoose.Schema = new mongoose.Schema(
  {
    comment: {
      type: String,
      required: true,
    },
    user: {
      type: String,
      required: true,
      ref: "users",
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
