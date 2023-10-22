import * as mongoose from "mongoose";
import { IBook } from "common-atom/interfaces/book.interface";
import { config } from "../config";
import { populatePlugin } from "../utils/schema/plugins/populatePlugin";

const BookSchema: mongoose.Schema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
    },
    priority: {
      type: Number,
      required: true,
      default: 1,
      validate: {
        validator: (val: number) => val <= 100 && val >= 1,
        message: `priority out of range (1-100)`,
      },
    },
    length: {
      type: Number,
      required: true,
    },
    isActive: {
      type: Boolean,
      required: true,
      default: true,
    },
    pdf: {
      type: String,
      required: true,
    },
    thumbNail: {
      type: String,
      required: true,
    },
    corp: {
      type: mongoose.Types.ObjectId,
      ref: "units",
    },
  },
  {
    versionKey: false,
    timestamps: { createdAt: true, updatedAt: true },
  }
);

// plugins
BookSchema.plugin(populatePlugin<IBook>, [{ property: "corp", ref: "units" }]);

export const BookModel = mongoose.model<IBook & mongoose.Document>(
  "books",
  BookSchema
);
