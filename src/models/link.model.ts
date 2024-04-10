import {Schema, Types, Document, model} from "mongoose";
import { Link } from "common-atom/interfaces/link";

const LinkSchema: Schema = new Schema(
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

export const LinkModel = model<Link & Document>(
  "links",
  LinkSchema,
);
