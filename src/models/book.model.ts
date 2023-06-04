import * as mongoose from "mongoose";
import { IBook } from "common-atom/interfaces/book.interface";
import { blobPlugin } from "../utils/schema/plugins/blobPlugin";
import { config } from "../config";

const bookSchema: mongoose.Schema = new mongoose.Schema(
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
        validator: (val: number) => val <= 3 && val >= 1,
        message: `priority out of range (1-3)`,
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
    // updatedAt: {
    //   type: Date,
    //   required: true,
    // },
    page: {
      type: Number,
      required: true,
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
bookSchema.plugin(blobPlugin<IBook>, config.formidable.propertyConfigs.book);

export const BookModel = mongoose.model<IBook & mongoose.Document>(
  "books",
  bookSchema
);
