import * as mongoose from "mongoose";
import { IBook } from "common-atom/interfaces/book.interface";

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
      type: String,
    },
  },
  {
    versionKey: false,
    timestamps: { createdAt: true, updatedAt: true },
  }
);

export const BookModel = mongoose.model<IBook & mongoose.Document>(
  "books",
  bookSchema
);
