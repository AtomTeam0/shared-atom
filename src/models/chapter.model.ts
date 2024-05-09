import {Schema, Document, model} from "mongoose";
import { IChapter } from "common-atom/interfaces/chapter.interface";

const ChapterDocumentSchema: Schema = new Schema(
  {
    title: {
      type: String,
      required: true,
    },
    description: {
      type: String,
    },
    page: { type: Number, required: true },
  },
  {
    versionKey: false,
    timestamps: { createdAt: false, updatedAt: false },
  },
);

export const ChapterModel = model<IChapter & Document>(
  "chapters",
  ChapterDocumentSchema,
);
