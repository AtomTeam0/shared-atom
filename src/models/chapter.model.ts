import * as mongoose from "mongoose";
import { IChapter } from "common-atom/interfaces/chapter.interface";

const ChapterSchema: mongoose.Schema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
    },
    description: {
      type: String,
    },
    page: {
      type: Number,
      required: true,
    },
  },
  {
    versionKey: false,
    timestamps: { createdAt: false, updatedAt: false },
  }
);

export const ChapterModel = mongoose.model<IChapter & mongoose.Document>(
  "chapters",
  ChapterSchema
);
