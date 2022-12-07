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
    toJSON: {
      virtuals: true,
      transform(_doc: any, ret: any): void {
        // eslint-disable-next-line no-param-reassign
        delete ret._id;
      },
    },

    versionKey: false,
    id: true,
    timestamps: { createdAt: true, updatedAt: false },
  }
);

// plugins
CommentSchema.plugin(populatePlugin, [{ path: "user", ref: "user" }]);

export const CommentModel = mongoose.model<IComment & mongoose.Document>(
  "comments",
  CommentSchema
);
