import * as mongoose from "mongoose";
import { Link } from "common-atom/interfaces/link";

const LinkSchema: mongoose.Schema = new mongoose.Schema(
  {
    url: {
      type: String,
      required: true,
    },
  },
  {
    versionKey: false,
    timestamps: { createdAt: false, updatedAt: false },
  },
);

export const LinkModel = mongoose.model<Link & mongoose.Document>(
  "links",
  LinkSchema,
);
