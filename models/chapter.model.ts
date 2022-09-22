import * as mongoose from "mongoose";
import { WatchMode } from "../enums/WatchMode";
import { IChapter } from "../interfaces/chapter.interface";
import { patchObjectPlugin } from "../utils/schema/plugins/patchPlugin";

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
    toJSON: {
      virtuals: true,
      transform(_doc: any, ret: any): void {
        // eslint-disable-next-line no-param-reassign
        delete ret._id;
      },
    },
    versionKey: false,
    id: true,
    timestamps: { createdAt: false, updatedAt: false },
  }
);

// plugins
ChapterSchema.plugin(patchObjectPlugin, {
  foreignArrayProperty: "chapters",
  foreignIdProperty: "chapterId",
  defaultValue: { mode: WatchMode.UNREAD },
});

export const ChapterModel = mongoose.model<IChapter & mongoose.Document>(
  "chapters",
  ChapterSchema
);
